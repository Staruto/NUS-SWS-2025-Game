import {
  set_dimensions, create_rectangle, create_sprite, update_scale, update_position, create_text, update_text,
  input_key_down, gameobjects_overlap, update_loop, build_game, create_circle, update_color, enable_debug,
  get_game_time
} from "arcade_2d";

enable_debug();

set_dimensions([1000, 600]);
const background = update_color(create_rectangle(2000, 2000), [255, 0, 0, 255]);

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
let alive = true;

// Ground and door
const ground = create_rectangle(1200, 400);
update_position(ground, [500, 500]);

const door = create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Door.jpg");
let door_base_pos = [920, 275];
update_position(door, door_base_pos);
let door_move_phase = "idle"; // "idle" | "exit_right" | "appear_left" | "move_right_to_target" | "last"
const left_door_target = [100, 275];

// Button parameters
const NUM_BUTTONS = 6;
const ButtonScale = [0.6, 0.6];
const ButtonsY = 295;
const button_positions = [
  [180, ButtonsY], [300, ButtonsY], [420, ButtonsY],
  [540, ButtonsY], [660, ButtonsY], [780, ButtonsY]
];
const buttons = [];
let totalPressed = 0;

for (let i = 0; i < NUM_BUTTONS; i = i + 1) {
  const normal = update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Button_origin.png"), ButtonScale);
  const clicked = update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Button_clicked.png"), ButtonScale);
  update_position(normal, button_positions[i]);
  update_position(clicked, [9999, 9999]);
  buttons[i] = [normal, clicked, false];
}

// Gear
const gear = update_color(update_scale(update_position(
  create_circle(200), [9999, 9999]),
  [1.5, 1.5]), [0, 0, 0, 255]
);
let gear_base_pos = [1300, 200];
let gear_active = false;
const GEAR_SPEED = 2.01;

// Shake control
let shakeEnabled = false;
let SHAKE_AMPLITUDE = 2;

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
    [door, door_base_pos]
  ];

  for (let i = 0; i < NUM_BUTTONS; i = i + 1) {
    const pos = button_positions[i];
    const clicked = buttons[i][1];
    const normal = buttons[i][0];
    const is_clicked = buttons[i][2];
    result[array_length(result)] = [is_clicked ? clicked : normal, pos];
  }

  if (gear_active) {
    result[array_length(result)] = [gear, gear_base_pos];
  }

  return result;
}

const text = update_color(update_position(create_text(""), [500, 400]), [0, 0, 0, 255]);

update_loop(game_state => {
    
    if (!alive)
    {
        return undefined;
    }
    
    const left = input_key_down("a");
    const right = input_key_down("d");
    const moving = left || right;
    // Player direction
    if (left && !facing_left) {
        facing_left = true;
        set_sprite_direction(player_frames, true);
    } else if (right && facing_left) {
        facing_left = false;
        set_sprite_direction(player_frames, false);
    }

    if (left)  { player_base_pos[0] = player_base_pos[0] - PLAYER_MOVE_SPEED; }
    if (right) { player_base_pos[0] = player_base_pos[0] + PLAYER_MOVE_SPEED; }
    // Player animation
    if (moving) {
        frame_counter = frame_counter + 1;
        if (frame_counter >= FRAME_DELAY) {
            frame_counter = 0;
            player_frame_index = player_frame_index + 1;
            if (player_frame_index > 3) {player_frame_index = 1; }
        }
    } else {
        player_frame_index = 0;
        frame_counter = 0;
    }

    // Button event
    for (let i = 0; i < NUM_BUTTONS; i = i + 1) {
        const normal = buttons[i][0];
        const clicked = buttons[i][1];
        const already_clicked = buttons[i][2];
        if (!already_clicked && gameobjects_overlap(current_player, normal)) {
            buttons[i][2] = true;
            update_position(normal, [9999, 9999]);
            update_position(clicked, button_positions[i]);
            PLAYER_MOVE_SPEED = math_max(1, PLAYER_MOVE_SPEED - 0.6);
            SHAKE_AMPLITUDE = SHAKE_AMPLITUDE + 2;
            shakeEnabled = true;
            totalPressed = totalPressed + 1;

            if (totalPressed === NUM_BUTTONS) {
            door_move_phase = "exit_right";
            gear_active = true;
            }
        }
    }

    // Door animation
    if (door_move_phase === "exit_right") {
        door_base_pos[0] = door_base_pos[0] + 5;
        if (door_base_pos[0] > 1100) { // beyond screen
            door_move_phase = "appear_left";
        }
    }
    else if (door_move_phase === "appear_left") {
        door_base_pos[0] = -100; // appear from left
        door_move_phase = "move_right_to_target";
    }
    else if (door_move_phase === "move_right_to_target") {
        door_base_pos[0] = door_base_pos[0] + 4;
        if (door_base_pos[0] >= left_door_target[0]) {
            door_base_pos[0] = left_door_target[0];
            door_move_phase = "last";
        }
    }
    else if (door_move_phase === "last" && player_base_pos[0] < 325) {
        door_base_pos[0] = door_base_pos[0] + 2;
    }


    // Gear movement
    if (gear_active) {
        gear_base_pos[0] = gear_base_pos[0] - GEAR_SPEED;
    }

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
        const go = objects[i][0];
        const base = objects[i][1];
        update_position(go, [base[0] + shake_offset[0], base[1] + shake_offset[1]]);
    }
    
    if (gear_active && gameobjects_overlap(current_player, gear))
    {
        alive = false;
        update_text(text, "Game over!");
    }
    if (gameobjects_overlap(current_player, door))
    {
        alive = false;
        update_text(text, "Next level.");
    }

  // render player
    update_sprite(player_frames, player_frame_index, [player_base_pos[0] + shake_offset[0], player_base_pos[1] + shake_offset[1]]);
});

build_game();