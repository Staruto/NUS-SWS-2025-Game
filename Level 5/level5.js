import {
  set_dimensions, create_rectangle, create_sprite, update_scale, update_position,
  input_key_down, gameobjects_overlap, update_loop, build_game, update_color,
  get_game_time
} from "arcade_2d";

set_dimensions([1000, 600]);
const background = update_color(create_rectangle(2000,2000),[255, 0, 0, 255]);

// Player parameters
let PLAYER_MOVE_SPEED = 5;
const player_scale = [0.7, 0.5];
const player_frames = [
    update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Static_Player.png"), player_scale),
    update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player1.png"), player_scale),
    update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player2.png"), player_scale),
    update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player3.png"), player_scale)
];

let player_frame_index = 0;
let frame_counter = 0;
const FRAME_DELAY = 3;
let facing_left = false;
let current_player = player_frames[0];
let player_base_pos = [70, 280];

// Ground and Door
const ground = create_rectangle(1200, 400);
update_position(ground, [500, 500]);
const door = create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Door.jpg");
update_position(door, [920, 275]);

// Def. of button
const NUM_BUTTONS = 6;
const ButtonScale = [0.6, 0.6];
const ButtonsY = 295;

const button_positions = [
    [180, ButtonsY],
    [300, ButtonsY],
    [420, ButtonsY],
    [540, ButtonsY],
    [660, ButtonsY],
    [780, ButtonsY]
];

const buttons = [];
for (let i = 0; i < NUM_BUTTONS; i = i + 1) {
    const normal = update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Button_origin.png"), ButtonScale);
    const clicked = update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Button_clicked.png"), ButtonScale);
    update_position(normal, button_positions[i]);
    update_position(clicked, [9999, 9999]); // Hide clicked button
    buttons[i] = [normal, clicked, false]; // [origin, clicked, bool is_clicked]
}

// Shake control
let SHAKE_AMPLITUDE = 2;
let shakeEnabled = false;

// Tool function: Hide all player models in current frame
function hide_all_frames(frames) {
    for (let i = 0; i < array_length(frames); i = i + 1) {
        update_position(frames[i], [9999, 9999]);
    }
}

// Tool function: update player direction
function set_sprite_direction(frames, face_left) {
    const scale = face_left ? [-player_scale[0], player_scale[1]] : player_scale;
    for (let i = 0; i < array_length(frames); i = i + 1) {
        update_scale(frames[i], scale);
    }
}

// Tool function: render player in current frame
function update_sprite(frames, index, pos) {
    hide_all_frames(frames);
    current_player = update_position(frames[index], pos);
    return current_player;
}

// Tool function: get all shakable objects
function get_all_shakable_objects() {
    const result = [
        [current_player, player_base_pos],
        [ground, [500, 500]],
        [door, [920, 275]]
    ];
    for (let i = 0; i < NUM_BUTTONS; i = i + 1) {
        const normal = buttons[i][0];
        const clicked = buttons[i][1];
        const is_clicked = buttons[i][2];
        const pos = button_positions[i];
        if (is_clicked) {
            result[array_length(result)] = [clicked, pos];
        } else {
            result[array_length(result)] = [normal, pos];
        }
    }
    return result;
}

update_loop(game_state => {
    const left = input_key_down("a");
    const right = input_key_down("d");
    const moving = left || right;

  // direction control
    if (left && !facing_left) {
        facing_left = true;
        set_sprite_direction(player_frames, true);
    } else if (right && facing_left) {
        facing_left = false;
        set_sprite_direction(player_frames, false);
    }

  // move control
    if (left) { player_base_pos[0] = player_base_pos[0] - PLAYER_MOVE_SPEED; }
    if (right) { player_base_pos[0] = player_base_pos[0] + PLAYER_MOVE_SPEED; }

  // animation construct
    if (moving) {
        frame_counter = frame_counter + 1;
        if (frame_counter >= FRAME_DELAY) {
            frame_counter = 0;
            player_frame_index = player_frame_index + 1;
            if (player_frame_index > 3) {
                player_frame_index = 1;
            }
        }
    } else {
        player_frame_index = 0;
        frame_counter = 0;
    }

  // button event
    for (let i = 0; i < NUM_BUTTONS; i = i + 1) {
        const normal = buttons[i][0];
        const clicked = buttons[i][1];
        const already_clicked = buttons[i][2];

        if (!already_clicked && gameobjects_overlap(current_player, normal)) {
            shakeEnabled = true;
            buttons[i][2] = true;
            update_position(normal, [9999, 9999]);
            update_position(clicked, button_positions[i]);
            PLAYER_MOVE_SPEED = math_max(1, PLAYER_MOVE_SPEED - 0.6);
            SHAKE_AMPLITUDE = SHAKE_AMPLITUDE + 2;
        }
    }

  // all objects
    const objects = get_all_shakable_objects();

  // restore to base pos
    for (let i = 0; i < array_length(objects); i = i + 1) {
        update_position(objects[i][0], objects[i][1]);
    }

  // calculate shake offset
    let shake_offset = [0, 0];
    if (shakeEnabled) {
        const a = (math_random() * 2 - 1) * SHAKE_AMPLITUDE;
        shake_offset = [a, a];
    }

  // apply shake offset
  for (let i = 0; i < array_length(objects); i = i + 1) {
    const obj = objects[i][0];
    const base = objects[i][1];
    update_position(obj, [base[0] + shake_offset[0], base[1] + shake_offset[1]]);
  }

  // render player
  update_sprite(player_frames, player_frame_index, [player_base_pos[0] + shake_offset[0], player_base_pos[1] + shake_offset[1]]);
});

build_game();