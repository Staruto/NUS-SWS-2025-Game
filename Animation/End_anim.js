import {
  set_dimensions, create_rectangle, create_sprite, update_scale, update_position,
  input_key_down, gameobjects_overlap, update_loop, build_game, create_circle,
  update_color, create_text, update_text, enable_debug, update_to_top, get_game_time
} from "arcade_2d";

const door = update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Door.png"), [0.2, 0.2]);
let door_base_pos = [920, 275]; // Replace with the initial door position in each level
update_position(door, door_base_pos);

let door_anim_y = door_base_pos[1]; // 当前动画中门的 y 位置
let end_anim = false;

let current_player = // Create a player object

update_loop(game_state => {
    
    if (!end_anim)
    {
        // Todo: Add normal game logic here
        if (gameobjects_overlap(current_player, door))
        {
            end_anim = true;

            // transport player to the center of door
            update_position(current_player, door_base_pos);
            door_anim_y = door_base_pos[1]; // reset animation pos
        }
    }
    else
    {
        update_text(text, "Animation start to play");
        const drop_speed = 2;
        door_anim_y = door_anim_y + drop_speed;

        update_position(current_player, [door_base_pos[0], door_anim_y]);
        update_position(door, [door_base_pos[0], door_anim_y]);

        // replace 350 with the desired y position where the animation ends
        if (door_anim_y >= 350) {
            end_anim = false;
            update_text(text, "Level Complete!");
            alive = false;
        }
    }
});

build_game();