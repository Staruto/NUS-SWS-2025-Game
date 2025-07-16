import { set_dimensions, create_rectangle, create_sprite, create_text, query_position, query_scale, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio, get_game_time } from "arcade_2d";
// enable_debug();
set_dimensions([1000, 600]);

let PLAYER_MOVE_SPEED = 5;
const GRAVITY = 2;
let on_object = false;
let tryjump = false;
let velocityY = 0;

const player_scale = [0.7, 0.5];
const player_frames = [
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Static_Player.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player1.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player2.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player3.png"), player_scale)
];

let player_frame_index = 0;
//let player_pos = [70, 300];
let facing_left = false;
let current_player = update_position(player_frames[0], [70, 280]);

// Hide player sprites in current frame
function hide_all_frames(frames) {
  for (let i = 0; i < array_length(frames); i = i + 1) {
    update_position(frames[i], [9999, 9999]);
  }
}

// update the sprite of player by hide other sprites
function update_sprite(frames, index, pos) {
  hide_all_frames(frames);
  current_player = update_position(frames[index], pos);
  return frames[index];             
}


function set_sprite_direction(frames, face_left) {
  const scale = face_left ? [-player_scale[0], player_scale[1]] : player_scale;
  for (let i = 0; i < array_length(frames); i = i + 1) {
    update_scale(frames[i], scale);
  }
}

let frame_counter = 0;
const FRAME_DELAY = 3;

const ground = update_position(create_rectangle(1200, 400), [500, 500]);

const door = update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Door.jpg"), [900, 280]);

const NUM_BUTTONS = 6;
const ButtonsY = 295;
const ButtonScale = [0.6, 0.6];

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
  update_position(clicked, [9999, 9999]); // Hide clicked img

  buttons[i] = [normal, clicked, false]; // [origin，clicked，is_clicked]
}

                
const allObjects = [current_player, door, ground];
let shakeTimer = 0;
const SHAKE_DURATION = 12; // Total 12 frames
let SHAKE_AMPLITUDE = 2; // amplitude 2

const objects = [
  [current_player, [70, 280]],
  [ground,         [500, 500]],
  [door,           [920, 275]]
  
];

update_loop(game_state => {
    
    const player = objects[0][0];
    const player_base_pos = objects[0][1];

    // ── 玩家输入 ──
    const left  = input_key_down("a");
    const right = input_key_down("d");
    const moving = left || right;

    if (left && !facing_left) {
        facing_left = true;
        set_sprite_direction(player_frames, true);
    } else if (right && facing_left) {
        facing_left = false;
        set_sprite_direction(player_frames, false);
    }

    if (left)  { player_base_pos[0] = player_base_pos[0] - PLAYER_MOVE_SPEED; }
    if (right) { player_base_pos[0] = player_base_pos[0] + PLAYER_MOVE_SPEED; }

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

    // activate shake after the first button clicked
    if (buttons[0][2] && shakeTimer === 0) {
        shakeTimer = SHAKE_DURATION;
    }

    // Remove offset from previous frame (restore base_pos)
    for (let i = 0; i < array_length(objects); i = i + 1) {
        update_position(objects[i][0], objects[i][1]);
    }

    // Calculate shake offset of current frame
    let shake_offset = [0, 0];
    if (shakeTimer > 0) {
        const a = (math_random() * 2 - 1) * SHAKE_AMPLITUDE;
        shake_offset = [a, a];
        shakeTimer = shakeTimer - 1;
    }

    // Apply shake effect to all objects
    for (let i = 0; i < array_length(objects); i = i + 1) {
        const go = objects[i][0];
        const base = objects[i][1];
        update_position(go, [base[0] + shake_offset[0], base[1] + shake_offset[1]]);
    }
  
  // Button event
    for (let i = 0; i < NUM_BUTTONS; i = i + 1) {
        const normal = buttons[i][0];
        const clicked = buttons[i][1];
        const already_clicked = buttons[i][2];

        if (!already_clicked && gameobjects_overlap(current_player, normal)) {
            // 标记为已点击
            buttons[i][2] = true;

            // 隐藏 normal sprite，显示 clicked sprite
            update_position(normal, [9999, 9999]);
            update_position(clicked, button_positions[i]);

            // 效果触发
            PLAYER_MOVE_SPEED = math_max(1, PLAYER_MOVE_SPEED - 0.6);
            SHAKE_AMPLITUDE = SHAKE_AMPLITUDE + 2;
        }
    }

    // Render player sprite in current frame (with shake)
    const render_pos = query_position(player);
    update_sprite(player_frames, player_frame_index, render_pos);
    
    // button
    //if (gameobjects_overlap(current_player, button_array))
});

build_game();