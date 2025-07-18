import {
  set_dimensions, create_rectangle, create_sprite, update_scale, update_position,
  input_key_down, gameobjects_overlap, update_loop, build_game, create_circle,
  update_color, create_text, update_text, enable_debug, update_to_top, get_game_time
} from "arcade_2d";

set_dimensions([1000, 600]);
const background = update_color(update_position(create_rectangle(2000, 2000), [0, 0]), [255, 255, 255, 255]);

let PLAYER_MOVE_SPEED = 5;
const FRAME_DELAY = 3;
const player_scale = [0.7, 0.5];

const player_frames_right = [
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Static_Player.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player1.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player2.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player3.png"), player_scale)
];

const player_frames_left = [
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Static_Player_flipped.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player1_flipped.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player2_flipped.png"), player_scale),
  update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player3_flipped.png"), player_scale)
];

let facing_left = false;          // true: left，false: right
let player_frame_index = 0;       // current anim. frame（0: idle，1~3: moving）
let frame_counter = 0;            // control sprite switch
let current_player = null;        // sprite displaying
let player_base_pos = [70, 280];  // player pos.

// hide all frames (No change to original version)
function hide_all_frames(frames) {
  for (let i = 0; i < array_length(frames); i = i + 1) {
    update_position(frames[i], [9999, 9999]);
  }
}

// Need to update
function update_sprite(player_base_pos) {
    const frames = facing_left ? player_frames_left : player_frames_right;
    hide_all_frames(player_frames_left);
    hide_all_frames(player_frames_right);
    current_player = update_position(frames[player_frame_index], player_base_pos);
    return current_player;
}

update_loop(game_state => {
    const left = input_key_down("a");
    const right = input_key_down("d");
    const moving = left || right;

    // update level
    if (left) {
        facing_left = true;
        player_base_pos[0] = player_base_pos[0] - PLAYER_MOVE_SPEED;
    }
    if (right) {
        facing_left = false;
        player_base_pos[0] = player_base_pos[0] + PLAYER_MOVE_SPEED;
    }

    // update anim. frame
    if (moving) {
        frame_counter = frame_counter + 1;
        if (frame_counter >= FRAME_DELAY) {
            frame_counter = 0;
            player_frame_index = player_frame_index + 1;
            if (player_frame_index > 3) { player_frame_index = 1; }
        }
    } else {
        player_frame_index = 0;
        frame_counter = 0;
    }

    // update spritw
    update_sprite(player_base_pos);


    // Other logic
});

build_game();
