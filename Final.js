import { set_dimensions, create_rectangle, create_circle,create_sprite, create_text, query_position, query_scale, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio, get_game_time } from "arcade_2d";
import{play,sine_sound,consecutively} from "sound";
function jumpSound() {
    const sound1 = sine_sound(660, 0.1);
    const sound3 = sine_sound(330, 0.05);
  play(consecutively(list(sound1,sound3)));
}
function respawnSound(){
    const sound1 = sine_sound(220, 0.1);
    const sound2 = sine_sound(330, 0.1);
    const sound3 = sine_sound(440, 0.1);
    const sound4 = sine_sound(550, 0.1);
    play(consecutively(list(sound1,sound2,sound3,sound4)));
}
function deathSound() {
    const sound1 = sine_sound(440, 0.1);
    const sound2 = sine_sound(330, 0.1);
    const sound3 = sine_sound(220, 0.2);
    const sound4 = sine_sound(110, 0.3);
    play(consecutively(list(sound1,sound2,sound3,sound4)));
}
function victorySound(){
    const sound1=sine_sound(523.25, 0.15);
    const sound2=sine_sound(659.25, 0.15);
    const sound3=sine_sound(783.99, 0.15);
    const sound4=sine_sound(1046.5, 0.3);
    play (consecutively(list(sound1,sound2,sound3,sound4)));
}
function buttonClickSound() {
    play(sine_sound(800, 0.05));
}

enable_debug();
set_dimensions([1000, 600]);
const GRAVITY = 2;
const JUMP_FORCE = -25;
const GROUND_LEVEL = 500;

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 40;

const PLAYER_MOVE_SPEED = 5;
const background=update_position(update_color(create_rectangle(1000,600),[205, 118, 71, 255]),[500,300]);
const player = update_position(create_rectangle(PLAYER_WIDTH, PLAYER_HEIGHT), [-700,-700]);
let t=0;
let k=-1;
let curtainSequence=0;
const curtain_1=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/curtain/curtain1.png"), [500,-300]);
const curtain_2=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/curtain/curtain2.png"), [500,900]);

const game_solids=[];
for(let i=0;i<32;i=i+1){ // Increased from 24 to 32 for longer hallway
    game_solids[i]=update_color(update_position(create_rectangle(100,100),[-500,-500]),[123,63,0,255]);
}

game_solids[32]=update_color(update_position(create_rectangle(100,100),[-500,-500]),[123,63,100,255]); // purple block
const game_traps=[];
for(let i=0;i<30;i=i+1){ // Increased from 20 to 30
    game_traps[i]=update_color(update_position(create_rectangle(40,20),[-500,-500]),[255,0,0,255]);
}

const game_through=[];
for(let i=0;i<5;i=i+1){
    game_through[i]=update_color(update_position(create_rectangle(40,40),[-500,-500]),[255,0,0,255]);
}

const buttons=[];
for(let i=0;i<7;i=i+1){
    buttons[i]=update_color(update_position(create_rectangle(40,40),[-500,-500]),[123,63,100,255]);
}
const door = update_position(create_rectangle(10, 40), [-500, -500]);
const transportDoor = update_position(create_rectangle(25, 25),[-500,-500]);
const collision_happened = update_scale(
    update_position(create_text(""), [-500, -500]), 
    [2.5, 2.5]
);

let currentState = "select";
const LEVEL_COUNT = 7;
const levelButtons=[];
for(let i=0;i<LEVEL_COUNT;i=i+1){
    levelButtons[i]=update_position(create_rectangle(60,60),[-500,500]);
}

const levelTexts=[];
for(let i=0;i<LEVEL_COUNT;i=i+1){
    levelTexts[i]=update_position(create_text(""),[-500,-500]);
}

// Add title text object at the top level
const titleText = update_position(create_text("TRY AGAIN"), [-500, -500]);

const hintText = update_scale(
        update_position(create_text("Press 1-6 to select level"), [-500,-500]),
        [1.5, 1.5]
    );
const levelDisplayText = update_scale(
        update_position(create_text(""), [-500,-500]),
        [4, 4]
    );
let objos_list_size = 0;
let objos_list = [];
let on_object = false;
let tryjump = false;
let velocityY = 0;
let alive = true;
let trapSequence = 0;
let gameTime = 0;
let SPIKES_MOVE_SPEED = 6;
let justEnteredLevel1 = false;

// --- Level 2 objects (from source2.js) ---
// All objects are hidden by default
const JUMP2_FORCE = -25;
const GRAVITY2 = 0.5;
const PLATFORM2_WIDTH = 1000;
const PLATFORM2_HEIGHT = 20;
const PLAYER2_SPEED = 7;
const TRAP2_SPEED = 7;

const player2 = update_position(create_rectangle(PLAYER_WIDTH, PLAYER_HEIGHT), [-500, -500]);
const platform2 = update_position(create_rectangle(PLATFORM2_WIDTH, PLATFORM2_HEIGHT), [-500, -500]);
const obstacle2 = update_position(create_rectangle(30, 290), [-500, -500]);
const door2 = update_position(create_rectangle(25, 33), [-500, -500]);
const trap2_1 = update_position(create_rectangle(20,20),[-500,-500]);
const trap2_2 = update_position(create_rectangle(20,20),[-500,-500]);
const button2_1 = update_position(create_rectangle(10,15),[-500,-500]);
const button2_2 = update_position(create_rectangle(10,15),[-500,-500]);
const button2_3 = update_position(create_rectangle(10,15),[-500,-500]);
const button2_4 = update_position(create_rectangle(10,15),[-500,-500]);
const button2_5 = update_position(create_rectangle(10,15),[-500,-500]);
const block2_1 = update_position(create_rectangle(120,30),[-500,-500]);
const block2_2 = update_position(create_rectangle(120,30),[-500,-500]);
const block2_3 = update_position(create_rectangle(120,30),[-500,-500]);
const block2_4 = update_position(create_rectangle(120,30),[-500,-500]);
const block2_5 = update_position(create_rectangle(120,30),[-500,-500]);
const traps2_1 = update_position(create_rectangle(50,10),[-500,-500]);
const traps2_21 = update_position(create_rectangle(50,10),[-500,-500]);
const traps2_22 = update_position(create_rectangle(50,10),[-500,-500]);

// Level 2 state
let isUpsideDown2 = false;
let velocityY2 = 0;
let canJump2 = true;
let trap2_1Touch = 0;
let trap2_2Touch = 0;
let button2_1Activated = false;
let button2_2Activated = false;
let button2_3Activated = false;
let button2_4Activated = false;
let button2_5Activated = false;
let gameOver2 = false;
let gameWon2 = false;

// --- Level 5 objects (from suncode.js) ---
const LEVEL5_GRAVITY = 2;
const LEVEL5_JUMP_FORCE = -15;
const LEVEL5_P_WIDTH = 12;
const LEVEL5_P_HEIGHT = 34;
const LEVEL5_P_MOVE_V = 4;
const LEVEL5_FALLING_V = 30;
const LEVEL5_TRANSLATING_V = 10;
const LEVEL5_APPEARING_V = 8;
const level5_ws = [1000,39,40,39,129,60,39,302,39,39,68,150,39];
const level5_hs = [120,204,204,200,204,204,150,204,204,160,204,204,204];

const level5_solids = [];
for(let i=0;i<13;i=i+1){
    level5_solids[i]=update_position(update_color(create_rectangle(level5_ws[i],level5_hs[i]),[47, 21, 9, 255]),[-500,-500]);
}
const level5_player = update_position(create_rectangle(LEVEL5_P_WIDTH, LEVEL5_P_HEIGHT), [-700,-700]);
const level5_door = update_position(create_rectangle(38,40),[-500,-500]);

// Level 5 state
let level5_on_obj = false;
let level5_vY = 0;
let level5_alive = true;
let level5_trapSequence = 0;
let level5_recoverSequence = -1;
let level5_gametime = 0;

// --- Tutorial Level objects (from tutoriallevel.js) ---
const TUTORIAL_PLATFORM_WIDTH = 1000;
const TUTORIAL_PLATFORM_HEIGHT = 20;
const TUTORIAL_PLAYER_WIDTH = 20;
const TUTORIAL_PLAYER_HEIGHT = 40;
const TUTORIAL_PLAYER_SPEED = 5;
const TUTORIAL_JUMP_FORCE = -15;
const TUTORIAL_GRAVITY = 1;
const TUTORIAL_CROUCH_HEIGHT = TUTORIAL_PLAYER_HEIGHT / 2;

const tutorial_platform = update_position(
    create_rectangle(TUTORIAL_PLATFORM_WIDTH, TUTORIAL_PLATFORM_HEIGHT),
    [-500, -500]
);



const tutorial_door = update_position(
    update_color(create_rectangle(30, 55), [0, 255, 0, 255]), // Green door
    [-500, -500]
);

const tutorial_obstacle = update_position(
    update_color(create_rectangle(30, 30), [255, 0, 0, 255]), // Red trap
    [-500, -500]
);

const tutorial_instructionText = update_scale(
    update_position(create_text(""), [-500, -500]), 
    [0.7, 0.7]
);

const tutorial_statusText = update_scale(
    update_position(create_text(""), [-500, -500]), 
    [1.0, 1.0]
);

// Tutorial Level state
let tutorial_playerVelocityY = 0;
let tutorial_isJumping = false;
let tutorial_isAlive = true;
let tutorial_hasWon = false;

// --- Player Animation Setup (for all levels) ---
const player_scale = [0.7, 0.5];
const player_frames = [
  update_position(update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Static_Player.png"), player_scale), [9999, 9999]),
  update_position(update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player1.png"), player_scale), [9999, 9999]),
  update_position(update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player2.png"), player_scale), [9999, 9999]),
  update_position(update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player3.png"), player_scale), [9999, 9999])
];
let player_frame_index = 0;
let frame_counter = 0;
const FRAME_DELAY = 3;
let facing_left = false;
let current_player = player_frames[0];

function hide_all_frames(frames) {
  for (let i = 0; i < array_length(frames); i = i + 1) {
    update_scale(update_position(frames[i], [9999, 9999]),[0.7,0.5]);
  }
}
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

function curtainsequence(){
    const curtain_1Pos=query_position(curtain_1);
    const curtain_2Pos=query_position(curtain_2);
    
    if(curtainSequence===0){
        update_to_top(update_position(curtain_1,[500,curtain_1Pos[1]+20]));
        update_to_top(update_position(curtain_2,[500,curtain_2Pos[1]-20]));
    }
    
    if(curtainSequence===0&&curtain_1Pos[1]>=270){
        curtainSequence=1;
        t=get_game_time();
    }
    
    if(curtainSequence===1&&get_game_time()-t>=300){
        curtainSequence=2;
    }
    
    if(curtainSequence===2){
        update_to_top(update_position(curtain_1,[500,curtain_1Pos[1]-20]));
        update_to_top(update_position(curtain_2,[500,curtain_2Pos[1]+20]));
    }
    
    if(curtainSequence===2&&curtain_1Pos[1]<=-300){
        curtainSequence=3;
    }
}
// In each level's setup/clear, call hide_all_frames(player_frames) and reset animation state.
// In all movement/collision, use current_player and its position, and animate as in runanimation.js/level 6.

function level1setup(){
    hide_all_frames(player_frames);
    player_frame_index = 0;
    frame_counter = 0;
    facing_left = false;
    current_player = player_frames[0];
    update_position(current_player, [70,300]);
    alive=true;
    update_position(door, [875, 305]); // moved door left to avoid overlap with right wall
    justEnteredLevel1 = true; // Set flag
    update_position(update_text(collision_happened, ""),[300,300]);
    // Floor row (longer hallway)
    for(let i=0;i<10;i=i+1){
        update_position(game_solids[i],[75+100*i,225]);
        objos_list[objos_list_size]=i;
        objos_list_size=objos_list_size+1;
    }
    // Ceiling row
    for(let i=10;i<20;i=i+1){
        update_position(game_solids[i],[75+100*(i-10),375]);
        objos_list[objos_list_size]=i;
        objos_list_size=objos_list_size+1;
    }
    // Left wall
    for(let i=20;i<26;i=i+1){
        update_position(game_solids[i],[-25,50+100*(i-20)]);
        objos_list[objos_list_size]=i;
        objos_list_size=objos_list_size+1;
    }
    // Right wall
    for(let i=26;i<32;i=i+1){
        update_position(game_solids[i],[975,50+100*(i-26)]);
        objos_list[objos_list_size]=i;
        objos_list_size=objos_list_size+1;
    }
    clear_death_pieces();
}

function clearlevel1(){
    // Hide all player frames
    hide_all_frames(player_frames);
    player_frame_index = 0;
    frame_counter = 0;
    facing_left = false;
    current_player = player_frames[0];
    update_position(player, [-700,-700]);
    update_position(door, [-500, -500]);
    for(let i=0;i<33;i=i+1){ // 0-32
        update_position(game_solids[i],[-500,-500]);
    }
    objos_list=[];
    objos_list_size=0;
    on_object=false;
    tryjump=false;
    velocityY=false;
    alive=false;
    trapSequence=0;
    gameTime=0;
    for(let i=0;i<30;i=i+1){ // 0-29
        update_color(update_position(game_traps[i],[-500,-500]),[255,0,0,255]);
    }
    update_position(transportDoor,[-500,-500]);
    update_position(update_text(collision_happened, ""),[-500,-500]);
    clear_death_pieces();
}

function level3setup(){
    hide_all_frames(player_frames);
    player_frame_index = 0;
    frame_counter = 0;
    facing_left = false;
    current_player = player_frames[0];
    update_position(current_player, [60,400]);
    alive=true;
    update_position(door, [940,430]);
    objos_list=[0,1,2,3,4,5,6,7,8,9,30,31,32]; // changed from 24 to 32
    objos_list_size=13;
    update_scale(update_position(game_solids[0],[50,600]),[3,3]);
    update_scale(update_position(game_solids[1],[950,600]),[3,3]);
    update_scale(update_position(game_solids[2],[500,200]),[4,0.5]);
    update_scale(update_position(game_solids[3],[500,0]),[10,0.5]);
    update_scale(update_position(game_solids[4],[580,150]),[0.2,0.2]);
    update_scale(update_position(game_solids[5],[620,150]),[0.2,0.2]);
    update_scale(update_position(game_solids[6],[620,110]),[0.2,0.2]);
    update_scale(update_position(game_solids[7],[660,150]),[0.2,0.2]);
    update_scale(update_position(game_solids[8],[660,110]),[0.2,0.2]);
    update_scale(update_position(game_solids[9],[660,70]),[0.2,0.2]);
    update_scale(update_position(game_through[0],[90,430]),[0.5,0.5]);
    update_scale(update_position(game_through[1],[130,430]),[0.5,0.5]);
    update_scale(update_position(game_traps[0],[170,430]),[0.5,1]);
    update_scale(update_position(game_solids[32],[255,530]),[0.5,0.5]); // changed from 24 to 32
    // Add left and right wall blocks just outside the screen
    update_scale(update_position(game_solids[30],[-50,300]),[1,6]); // left wall
    update_scale(update_position(game_solids[31],[1050,300]),[1,6]); // right wall
}
function move_obstacle_left(ob,speed) {
    debug_log("moving obstacles");
    return update_position(ob,[query_position(ob)[0]-speed,query_position(ob)[1]]);
}

function move_obstacle_right(ob,speed) {
    debug_log("moving obstacles");
    return update_position(ob,[query_position(ob)[0]+speed,query_position(ob)[1]]);
}

function move_obstacle_up(ob,speed) {
    debug_log("moving obstacles");
    return update_position(ob,[query_position(ob)[0],query_position(ob)[1]-speed]);
}

function move_obstacle_down(ob,speed) {
    debug_log("moving obstacles");
    return update_position(ob,[query_position(ob)[0],query_position(ob)[1]+speed]);
}

function clearlevel3(){
    // Hide all player frames
    hide_all_frames(player_frames);
    player_frame_index = 0;
    frame_counter = 0;
    facing_left = false;
    current_player = player_frames[0];
    update_position(player, [-700,-700]);
    update_position(door, [-500, -500]);
    for(let i=0;i<33;i=i+1){ // 0-32
        update_scale(update_position(game_solids[i],[-500,-500]),[1,1]);
    }
    update_position(game_solids[32],[-500,-500]); // Ensure special block is reset
    for(let i=0;i<30;i=i+1){ // 0-29
        update_scale(update_color(update_position(game_traps[i],[-500,-500]),[255,0,0,255]),[1,1]);
        
    }
    for(let i=0;i<5;i=i+1){
        update_scale(update_position(game_through[i],[-500,-500]),[1,1]);
    }
    update_position(transportDoor,[-500,-500]);
    update_position(update_text(collision_happened, ""),[-500,-500]);
    objos_list=[];
    objos_list_size=0;
    on_object=false;
    tryjump=false;
    velocityY=0;
    alive=false;
    trapSequence=0;
    gameTime=0;
}
function initSelect() {
    // Hide any lingering collision text
    update_position(update_text(collision_happened, ""), [-500, -500]);
    // Hide all player frames and current_player to prevent lingering player images
    hide_all_frames(player_frames);
    update_position(current_player, [9999, 9999]);
    // Hide level 6 player frames and current player to prevent lingering player images
    for (let i = 0; i < array_length(level6_player_frames); i = i + 1) {
        update_position(level6_player_frames[i], [9999, 9999]);
    }
    update_position(level6_current_player, [9999, 9999]);
    // Hide all Level 2 buttons and traps from main screen
    update_position(button2_1, [-500, -500]);
    update_position(button2_2, [-500, -500]);
    update_position(button2_3, [-500, -500]);
    update_position(button2_4, [-500, -500]);
    update_position(button2_5, [-500, -500]);
    update_position(trap2_1, [-500, -500]);
    update_position(trap2_2, [-500, -500]);
    update_position(traps2_1, [-500, -500]);
    update_position(traps2_21, [-500, -500]);
    update_position(traps2_22, [-500, -500]);
    // Adjusted for [1000,600]
    const LEVEL_CELL_WIDTH = 60;
    const LEVEL_CELL_HEIGHT = 60;
    const LEVEL_CELL_SPACING = 60; // increased spacing for wider screen
    const START_X = 140; // moved right for centering
    const START_Y = 200;
    
    let i = 0;
    while (i < LEVEL_COUNT) {
        const xPos = START_X + i * (LEVEL_CELL_WIDTH + LEVEL_CELL_SPACING);
        // 创建关卡按钮
        update_position(levelButtons[i],[xPos, START_Y]);
        update_color(levelButtons[i], [255,255,255,255]); // ensure white
        // 创建关卡文本
        let textContent = "Level";
        if (i === 0){
            textContent = "Tutorial";}
        if (i === 1) {
            textContent = textContent + "1";}
        if (i === 2) {
            textContent = textContent + "2";}
        if (i === 3) {
            textContent = textContent + "3";}
        if (i === 4) {
            textContent = textContent + "4";}
        if (i === 5) {
            textContent = textContent + "5";}
        if (i === 6) {
            textContent = textContent + "6";}
        update_text(update_scale(update_position(levelTexts[i], 
            [xPos , START_Y + LEVEL_CELL_HEIGHT / 1.5]),
            [1, 1]),
            textContent
        );
        i = i + 1;
    }
    // Center title and hint for 1000 width
    update_scale(update_position(titleText, [500, 100]),[3, 3]);
    update_scale(update_position(hintText, [500, 500]),[1.5, 1.5]);
    update_text(hintText, "Press 0-6 to select level (0=Tutorial)");
    update_scale(update_position(levelDisplayText, [500, 300]),[4, 4]);
    debug_log("Select screen initialized");
}

function clearselect(){
    let i = 0;
    while (i < LEVEL_COUNT) {
        update_position(levelButtons[i],[-500,-500]);
        update_position(levelTexts[i],[-500,-500]);
        i = i + 1;
    }
    update_position(titleText,[-500,-500]);
    update_position(hintText,[-500,-500]);
    update_position(levelDisplayText,[-500,-500]);
    debug_log("Select screen cleared");
}

function level2setup() {
    hide_all_frames(player_frames);
    player_frame_index = 0;
    frame_counter = 0;
    facing_left = false;
    current_player = player_frames[0];
    update_position(current_player, [300,250]);
    update_scale(current_player, [0.7, 0.5]);
    update_color(current_player, [255,255,255,255]); // player white
    update_position(platform2, [500, 300]);
    update_scale(platform2, [1, 1]);
    update_color(platform2, [123,63,0,255]); // platform brown
    update_position(obstacle2, [860, 150]);
    update_scale(obstacle2, [1, 1]);
    update_color(obstacle2, [123,63,0,255]); // obstacle brown
    update_position(door2, [975, 270]);
    update_scale(door2, [1, 1]);
    update_color(door2, [255,255,255,255]); // door white
    update_position(trap2_1, [10, 280]);
    update_scale(trap2_1, [1, 1]);
    update_color(trap2_1, [255,0,0,255]); // trap red
    update_position(trap2_2, [535, 320]);
    update_scale(trap2_2, [1, 1]);
    update_color(trap2_2, [255,0,0,255]); // trap red
    update_position(button2_1, [160, 320]);
    update_scale(button2_1, [1, 1]);
    update_color(button2_1, [0,0,255,255]); // button blue
    update_position(button2_2, [350, 300]);
    update_scale(button2_2, [1, 1]);
    update_color(button2_2, [0,0,255,255]); // button blue
    update_position(button2_3, [800, 300]);
    update_scale(button2_3, [1, 1]);
    update_color(button2_3, [0,0,255,255]); // button blue
    update_position(button2_4, [350, 300]);
    update_scale(button2_4, [1, 1]);
    update_color(button2_4, [0,0,255,255]); // button blue
    update_position(button2_5, [600, 300]);
    update_scale(button2_5, [1, 1]);
    update_color(button2_5, [0,0,255,255]); // button blue
    update_position(block2_1, [938, 130]);
    update_scale(block2_1, [1, 1]);
    update_color(block2_1, [123,63,0,255]); // block brown
    update_position(block2_2, [938, 100]);
    update_scale(block2_2, [1, 1]);
    update_color(block2_2, [123,63,0,255]); // block brown
    update_position(block2_3, [938, 70]);
    update_scale(block2_3, [1, 1]);
    update_color(block2_3, [123,63,0,255]); // block brown
    update_position(block2_4, [938, 10]);
    update_scale(block2_4, [1, 1]);
    update_color(block2_4, [123,63,0,255]); // block brown
    update_position(block2_5, [938, 40]);
    update_scale(block2_5, [1, 1]);
    update_color(block2_5, [123,63,0,255]); // block brown
    update_position(traps2_1, [317, 300]);
    update_scale(traps2_1, [1, 1]);
    update_color(traps2_1, [255,0,0,255]); // trap red
    update_position(traps2_21, [633, 300]);
    update_scale(traps2_21, [1, 1]);
    update_color(traps2_21, [255,0,0,255]); // trap red
    update_position(traps2_22, [567, 300]);
    update_scale(traps2_22, [1, 1]);
    update_color(traps2_22, [255,0,0,255]); // trap red
    update_position(update_text(collision_happened, ""), [500, 300]);
    update_scale(collision_happened, [2.5, 2.5]);
    isUpsideDown2 = false;
    velocityY2 = 0;
    canJump2 = true;
    trap2_1Touch = 0;
    trap2_2Touch = 0;
    button2_1Activated = false;
    button2_2Activated = false;
    button2_3Activated = false;
    button2_4Activated = false;
    button2_5Activated = false;
    gameOver2 = false;
    gameWon2 = false;
}

function clearlevel2() {
    // Hide all player frames
    hide_all_frames(player_frames);
    player_frame_index = 0;
    frame_counter = 0;
    facing_left = false;
    current_player = player_frames[0];
    for(let i=0;i<array_length(player_frames);i=i+1){
        update_scale(player_frames[i],[1,1]);
    }
    update_scale(current_player,[0.7,0.5]);
    update_position(player2, [-700, -700]);
    update_scale(player2, [1, 1]);
    update_color(player2, [255,255,255,255]); // player white
    update_position(platform2, [-500, -500]);
    update_scale(platform2, [1, 1]);
    update_color(platform2, [123,63,0,255]); // platform brown
    update_position(obstacle2, [-500, -500]);
    update_scale(obstacle2, [1, 1]);
    update_color(obstacle2, [123,63,0,255]); // obstacle brown
    update_position(door2, [-500, -500]);
    update_scale(door2, [1, 1]);
    update_color(door2, [255,255,255,255]); // door white
    update_position(trap2_1, [-500, -500]);
    update_scale(trap2_1, [1, 1]);
    update_color(trap2_1, [255,0,0,255]); // trap red
    update_position(trap2_2, [-500, -500]);
    update_scale(trap2_2, [1, 1]);
    update_color(trap2_2, [255,0,0,255]); // trap red
    update_position(button2_1, [-500, -500]);
    update_scale(button2_1, [1, 1]);
    update_color(button2_1, [0,0,255,255]); // button blue
    update_position(button2_2, [-500, -500]);
    update_scale(button2_2, [1, 1]);
    update_color(button2_2, [0,0,255,255]); // button blue
    update_position(button2_3, [-500, -500]);
    update_scale(button2_3, [1, 1]);
    update_color(button2_3, [0,0,255,255]); // button blue
    update_position(button2_4, [-500, -500]);
    update_scale(button2_4, [1, 1]);
    update_color(button2_4, [0,0,255,255]); // button blue
    update_position(button2_5, [-500, -500]);
    update_scale(button2_5, [1, 1]);
    update_color(button2_5, [0,0,255,255]); // button blue
    update_position(block2_1, [-500, -500]);
    update_scale(block2_1, [1, 1]);
    update_color(block2_1, [123,63,0,255]); // block brown
    update_position(block2_2, [-500, -500]);
    update_scale(block2_2, [1, 1]);
    update_color(block2_2, [123,63,0,255]); // block brown
    update_position(block2_3, [-500, -500]);
    update_scale(block2_3, [1, 1]);
    update_color(block2_3, [123,63,0,255]); // block brown
    update_position(block2_4, [-500, -500]);
    update_scale(block2_4, [1, 1]);
    update_color(block2_4, [123,63,0,255]); // block brown
    update_position(block2_5, [-500, -500]);
    update_scale(block2_5, [1, 1]);
    update_color(block2_5, [123,63,0,255]); // block brown
    update_position(traps2_1, [-500, -500]);
    update_scale(traps2_1, [1, 1]);
    update_color(traps2_1, [255,0,0,255]); // trap red
    update_position(traps2_21, [-500, -500]);
    update_scale(traps2_21, [1, 1]);
    update_color(traps2_21, [255,0,0,255]); // trap red
    update_position(traps2_22, [-500, -500]);
    update_scale(traps2_22, [1, 1]);
    update_color(traps2_22, [255,0,0,255]); // trap red
    // Ensure collision text is hidden and reset
    update_position(update_text(collision_happened, ""), [-500, -500]);
    update_scale(collision_happened, [2.5, 2.5]);
    isUpsideDown2 = false;
    velocityY2 = 0;
    canJump2 = true;
    trap2_1Touch = 0;
    trap2_2Touch = 0;
    button2_1Activated = false;
    button2_2Activated = false;
    button2_3Activated = false;
    button2_4Activated = false;
    button2_5Activated = false;
    gameOver2 = false;
    gameWon2 = false;
}

function level4setup(){
    alive = true;
    // Player start position (left platform)
    update_scale(update_position(player, [150, 500]),[1,1]);
    // Door position (right platform)
    update_position(door, [930, 530]);
    // Clear all solids first
    for(let i=0;i<33;i=i+1){
        update_scale(update_position(game_solids[i],[-500,-500]),[1,1]);
    }
    // Clear all traps first
    for(let i=0;i<30;i=i+1){
        update_scale(update_color(update_position(game_traps[i],[-500,-500]),[255,0,0,255]),[1,1]);
    }
    objos_list = [0,1,2,3,4,5,6,7,8,9];
    objos_list_size = 10;
    // Floor left platform
    update_scale(update_position(game_solids[0],[125,600]),[1.3,1]); // left floor
    // Floor right platform
    update_scale(update_position(game_solids[1],[905,600]),[2.5,1]); // right floor
    // Left wall
    update_scale(update_position(game_solids[2],[10,350]),[1,10]);
    // Right wall
    update_scale(update_position(game_solids[3],[990,350]),[1,10]);
    // Ceiling (long horizontal block)
    update_scale(update_position(game_solids[4],[500,40]),[10,0.9]);
    // Left ledge
    update_scale(update_position(game_solids[5],[85,150]),[0.5,2]);
    // Right ledge
    update_scale(update_position(game_solids[6],[915,280]),[0.5,4]);
    update_scale(update_position(game_solids[7],[80,250]),[2,0.5]);
    update_scale(update_position(game_solids[8],[230,600]),[1,1]); // left floor
    update_scale(update_position(buttons[0],[80,530]),[0.5,0.5]); 
    update_scale(update_position(buttons[1],[160,295]),[0.5,0.5]);
    update_scale(update_position(buttons[2],[795,530]),[0.5,0.5]);
    update_scale(update_position(buttons[3],[500,650]),[0.5,0.5]);
    update_scale(update_position(game_solids[9],[-500,-500]),[3,1]);
    // Place spikes (game_traps) along the ceiling
    // Approximate positions for 8 spikes, spaced evenly
    const spikeY = 85;
    const spikeScale = [1, 1.5];
    const spikeXs = [170, 290, 410, 530, 650, 770];
    for(let i=0;i<6;i=i+1){
        update_scale(update_color(update_position(game_traps[i],[spikeXs[i],spikeY]),[255,0,0,255]), spikeScale);
    }
    update_position(update_text(collision_happened, ""), [300, 300]);
}

function clearlevel4(){
    // Hide player and door
    update_position(player, [-700,-700]);
    update_position(door, [-500, -500]);
    // Reset all solids to offscreen and scale to [1,1]
    for(let i=0;i<33;i=i+1){
        update_scale(update_position(game_solids[i],[-500,-500]),[1,1]);
    }
    // Hide all spikes/traps and reset their color and scale
    for(let i=0;i<30;i=i+1){
        update_scale(update_color(update_position(game_traps[i],[-500,-500]),[255,0,0,255]),[1,1]);
    }
    // Hide all through platforms
    for(let i=0;i<5;i=i+1){
        update_scale(update_position(game_through[i],[-500,-500]),[1,1]);
    }
    // Hide all buttons and reset their scale and color
    for(let i=0;i<7;i=i+1){
        update_scale(update_color(update_position(buttons[i],[-500,-500]),[123,63,100,255]),[1,1]);
    }
    // Hide transport door
    update_position(transportDoor,[-500,-500]);
    // Hide collision text
    update_position(update_text(collision_happened, ""),[-500,-500]);
    // Reset state variables
    objos_list=[];
    objos_list_size=0;
    on_object=false;
    tryjump=false;
    velocityY=0;
    alive=false;
    trapSequence=0;
    gameTime=0;
}

function level5setup(){
    hide_all_frames(player_frames);
    player_frame_index = 0;
    frame_counter = 0;
    facing_left = false;
    current_player = player_frames[0];
    update_position(current_player, [100,229]);
    update_position(update_text(collision_happened, ""),[300,300]);
    // Place all objects in their starting positions
    for(let i=0;i<13;i=i+1){
        // Place solids as in suncode.js
        const positions = [
            [500,60],[96,348],[134,348],[212,348],[219,348],[313,348],[421,346],[494,348],[664,348],[768,326],[717,348],[824,348],[918,348]
        ];
        update_position(level5_solids[i], positions[i]);
        update_color(level5_solids[i],[47,21,9,255]);
    }
    update_position(level5_door,[918,226]);
    level5_on_obj = false;
    level5_vY = 0;
    level5_alive = true;
    level5_trapSequence = 0;
    level5_recoverSequence = -1;
    level5_gametime = 0;
}

function clearlevel5(){
    // Hide all player frames
    hide_all_frames(player_frames);
    player_frame_index = 0;
    frame_counter = 0;
    facing_left = false;
    current_player = player_frames[0];
    update_position(level5_player, [-700,-700]);
    for(let i=0;i<13;i=i+1){
        update_position(level5_solids[i],[-500,-500]);
        update_color(level5_solids[i],[47,21,9,255]);
    }
    update_position(level5_door,[-500,-500]);
    level5_on_obj = false;
    level5_vY = 0;
    level5_alive = false;
    level5_trapSequence = 0;
    level5_recoverSequence = -1;
    level5_gametime = 0;
    update_position(update_text(collision_happened, ""),[300,300]);
}

function tutorialsetup(){
    // Hide all player frames initially
    hide_all_frames(player_frames);
    // Position the player at starting location
    update_position(current_player, [200, 270]);
    // Place all tutorial objects in their starting positions
    update_position(tutorial_platform, [500, 300]);
    update_position(tutorial_door, [980, 277]);
    update_position(tutorial_obstacle, [600, 270]);
    update_position(tutorial_instructionText, [500, 50]);
    update_position(tutorial_statusText, [500, 100]);
    update_text(tutorial_instructionText, "");
    update_text(tutorial_statusText, "");
    // Hide any unwanted doors or objects
    update_position(door, [-500, -500]);
    update_position(transportDoor, [-500, -500]);
    // Reset tutorial state variables
    tutorial_playerVelocityY = 0;
    tutorial_isJumping = false;
    tutorial_isAlive = true;
    tutorial_hasWon = false;
    // Clear death pieces
    clear_death_pieces();
}

function cleartutorial(){
    // Hide all player frames
    hide_all_frames(player_frames);
    // Hide the current player
    update_position(current_player, [9999, 9999]);
    // Hide all tutorial objects
    update_position(tutorial_platform, [-500, -500]);
    update_position(tutorial_door, [-500, -500]);
    update_position(tutorial_obstacle, [-500, -500]);
    update_position(tutorial_instructionText, [-500, -500]);
    update_position(tutorial_statusText, [-500, -500]);
    // Hide any unwanted doors or objects
    update_position(door, [-500, -500]);
    update_position(transportDoor, [-500, -500]);
    // Reset tutorial state variables
    tutorial_playerVelocityY = 0;
    tutorial_isJumping = false;
    tutorial_isAlive = true;
    tutorial_hasWon = false;
    // Clear death pieces
    clear_death_pieces();
}

// --- Level 6 objects (from level6.js) ---
let level6_alive = true;
let level6_player_move_speed = 5;
let level6_player_scale = [0.7, 0.5];
let level6_player_frames = [
  update_position(update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Static_Player.png"), [0.7, 0.5]), [9999, 9999]),
  update_position(update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player1.png"), [0.7, 0.5]), [9999, 9999]),
  update_position(update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player2.png"), [0.7, 0.5]), [9999, 9999]),
  update_position(update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Dynamic_Player3.png"), [0.7, 0.5]), [9999, 9999])
];
let level6_player_frame_index = 0;
let level6_frame_counter = 0;
const LEVEL6_FRAME_DELAY = 3;
let level6_facing_left = false;
let level6_current_player = level6_player_frames[0];
let level6_player_base_pos = [70, 280];
let level6_ground = update_position(create_rectangle(1200, 400), [9999, 9999]);
let level6_door = update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Door.jpg"), [9999, 9999]);
let level6_door_base_pos = [920, 275];
let level6_door_move_phase = "idle";
const LEVEL6_LEFT_DOOR_TARGET = [100, 275];
const LEVEL6_NUM_BUTTONS = 6;
const LEVEL6_ButtonScale = [0.6, 0.6];
const LEVEL6_ButtonsY = 295;
const LEVEL6_button_positions = [
  [180, LEVEL6_ButtonsY], [300, LEVEL6_ButtonsY], [420, LEVEL6_ButtonsY],
  [540, LEVEL6_ButtonsY], [660, LEVEL6_ButtonsY], [780, LEVEL6_ButtonsY]
];
let level6_buttons = [];
for (let i = 0; i < LEVEL6_NUM_BUTTONS; i = i + 1) {
  const normal = update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Button_origin.png"), LEVEL6_ButtonScale);
  const clicked = update_scale(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/Assets/Button_clicked.png"), LEVEL6_ButtonScale);
  update_position(normal, [9999, 9999]);
  update_position(clicked, [9999, 9999]);
  level6_buttons[i] = [normal, clicked, false];
}
let level6_totalPressed = 0;
let level6_gear = update_color(update_scale(update_position(create_circle(200), [9999, 9999]), [1.5, 1.5]), [0, 0, 0, 255]);
let level6_gear_base_pos = [1300, 200];
let level6_gear_active = false;
const LEVEL6_GEAR_SPEED = 2.01;
let level6_shakeEnabled = false;
let LEVEL6_SHAKE_AMPLITUDE = 2;
let level6_text = update_color(update_position(create_text(""), [9999, 9999]), [0, 0, 0, 255]);

function level6setup() {
  level6_alive = true;
  level6_player_move_speed = 5;
  level6_player_scale = [0.7, 0.5];
  level6_player_frame_index = 0;
  level6_frame_counter = 0;
  level6_facing_left = false;
  level6_current_player = level6_player_frames[0];
  level6_player_base_pos = [70, 280];
  update_position(level6_ground, [500, 500]);
  update_position(level6_door, [920, 275]);
  level6_door_base_pos = [920, 275];
  level6_door_move_phase = "idle";
  level6_totalPressed = 0;
  for (let i = 0; i < LEVEL6_NUM_BUTTONS; i = i + 1) {
    update_position(level6_buttons[i][0], LEVEL6_button_positions[i]);
    update_position(level6_buttons[i][1], [9999, 9999]);
    level6_buttons[i][2] = false;
  }
  update_position(level6_gear, [9999, 9999]);
  level6_gear_base_pos = [1300, 200];
  level6_gear_active = false;
  LEVEL6_SHAKE_AMPLITUDE = 2;
  level6_shakeEnabled = false;
  update_position(level6_text, [500, 400]);
  update_text(level6_text, "");
  update_position(update_text(collision_happened, ""),[300,300]);
}

function clearlevel6() {
  // Hide all player frames (both level6_player_frames and global player_frames)
  hide_all_frames(player_frames);
  for (let i = 0; i < LEVEL6_NUM_BUTTONS; i = i + 1) {
    update_position(level6_buttons[i][0], [9999, 9999]); // normal
    update_position(level6_buttons[i][1], [9999, 9999]); // clicked
    level6_buttons[i][2] = false;
  }
  for (let i = 0; i < array_length(level6_player_frames); i = i + 1) {
    update_position(level6_player_frames[i], [9999, 9999]);
    update_scale(level6_player_frames[i], [0.7, 0.5]);
  }
  update_position(level6_ground, [9999, 9999]);
  update_position(level6_door, [9999, 9999]);
  update_position(level6_gear, [9999, 9999]);
  update_position(level6_text, [9999, 9999]);
  // Also reset any other Level 6 state variables if needed
  level6_alive = false;
  level6_player_move_speed = 5;
  level6_player_scale = [0.7, 0.5];
  level6_player_frame_index = 0;
  level6_frame_counter = 0;
  level6_facing_left = false;
  level6_current_player = level6_player_frames[0];
  level6_player_base_pos = [70, 280];
  level6_door_base_pos = [920, 275];
  level6_door_move_phase = "idle";
  level6_totalPressed = 0;
  level6_gear_base_pos = [1300, 200];
  level6_gear_active = false;
  LEVEL6_SHAKE_AMPLITUDE = 2;
  level6_shakeEnabled = false;
}

function level6_hide_all_frames(frames) {
  for (let i = 0; i < array_length(frames); i = i + 1) {
    update_position(frames[i], [9999, 9999]);
  }
}

function level6_set_sprite_direction(frames, face_left) {
  const scale = face_left ? [-level6_player_scale[0], level6_player_scale[1]] : level6_player_scale;
  for (let i = 0; i < array_length(frames); i = i + 1) {
    update_scale(frames[i], scale);
  }
}

function level6_update_sprite(frames, index, pos) {
  level6_hide_all_frames(frames);
  level6_current_player = update_position(frames[index], pos);
  return level6_current_player;
}

function level6_get_all_shakable_objects() {
  const result = [
    [level6_current_player, level6_player_base_pos],
    [level6_ground, [500, 500]],
    [level6_door, level6_door_base_pos]
  ];
  for (let i = 0; i < LEVEL6_NUM_BUTTONS; i = i + 1) {
    const pos = LEVEL6_button_positions[i];
    const clicked = level6_buttons[i][1];
    const normal = level6_buttons[i][0];
    const is_clicked = level6_buttons[i][2];
    result[array_length(result)] = [is_clicked ? clicked : normal, pos];
  }
  if (level6_gear_active) {
    result[array_length(result)] = [level6_gear, level6_gear_base_pos];
  }
  return result;
}

// --- Death Animation Setup (direct integration) ---
const death_pieces = [];
death_pieces[0]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static.png"),[-100,-100]);
death_pieces[1]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(1).png"),[-100,-100]);
death_pieces[2]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(2).png"),[-100,-100]);
death_pieces[3]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(3).png"),[-100,-100]);
death_pieces[4]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(4).png"),[-100,-100]);
death_pieces[5]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(5).png"),[-100,-100]);
death_pieces[6]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(6).png"),[-100,-100]);
death_pieces[7]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(7).png"),[-100,-100]);
death_pieces[8]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(8).png"),[-100,-100]);
death_pieces[9]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(9).png"),[-100,-100]);
death_pieces[10]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(10).png"),[-100,-100]);
death_pieces[11]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(11).png"),[-100,-100]);
death_pieces[12]=update_position(create_sprite("https://raw.githubusercontent.com/Staruto/NUS-SWS-2025-Game/refs/heads/main/death/static%20pieces%20-(12).png"),[-100,-100]);
const death_pieces_W=[12,5,7,4,6,4,5,8,2,6,8,5,5];
const death_pieces_H=[34,4,8,12,11,10,16,11,5,8,5,9,5];
let death_piecesVX = [];
let death_piecesVY = [];
let death_pis_on_obj=[];
for(let i=1;i<=12;i=i+1){
    death_piecesVX[i]=(math_random() -0.5)*30;
    death_piecesVY[i]=(math_random()-0.5)*30;
    death_pis_on_obj[i]=0;
}
let death_animation_active = false;
let death_animation_player_index = 0;
// Helper to clear all death pieces and reset state
function clear_death_pieces() {
    for(let j = 1; j <= 12; j = j + 1){
        update_position(death_pieces[j], [-100, -100]);
    }
    death_animation_active = false;
}

// Add at the top-level scope
let pendingTransition = null;

update_loop(game_state => {
    update_to_top(collision_happened);
    curtainsequence();
    debug_log("Current state: " + stringify(currentState));
    // Tutorial Level 0.5: Wait for user input after finishing tutorial
    if(currentState===0.5){
        // Show 'Next level' message (already set)
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_tutorial";
        }
        if(input_key_down("n") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "next1";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_tutorial"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_tutorial"){
            cleartutorial();
            initSelect();
        }
        if(curtainSequence === 3 && pendingTransition === "next1"){
            currentState=1;
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "next1"){
            cleartutorial();
            clearlevel1();
            level1setup();
        }
        if(input_key_down("r")){
            cleartutorial();
            tutorialsetup();
            tutorial_isAlive=true;
            tutorial_hasWon=false;
        }
    }
    // Tutorial Level (currentState===0)
    if(currentState===0){
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_tutorial";
            curtainsequence();
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_tutorial"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_tutorial"){
            cleartutorial();
            clear_death_pieces();
            initSelect();
        }
        if(!pendingTransition){
            if(input_key_down("r")){
                cleartutorial();
                tutorialsetup();
                tutorial_isAlive=true;
                tutorial_hasWon=false;
            }
            
            if (!tutorial_isAlive || tutorial_hasWon){
                if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
                    curtainSequence = 0;
                    pendingTransition = "main_from_tutorial";
                    curtainsequence();
                }
                if(curtainSequence === 3 && pendingTransition === "main_from_tutorial"){
                    currentState="select";
                    pendingTransition = null;
                }
                if(curtainSequence === 2 && pendingTransition === "main_from_tutorial"){
                    cleartutorial();
                    clear_death_pieces();
                    initSelect();
                }
                if(input_key_down("r")){
                    cleartutorial();
                    tutorialsetup();
                    tutorial_isAlive=true;
                    tutorial_hasWon=false;
                }
            }
            
            //Player return to Select Screen
            if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
                curtainSequence = 0;
                pendingTransition = "main_from_tutorial";
                curtainsequence();
            }
            if(curtainSequence === 3 && pendingTransition === "main_from_tutorial"){
                currentState="select";
                pendingTransition = null;
            }
            if(curtainSequence === 2 && pendingTransition === "main_from_tutorial"){
                cleartutorial();
                clear_death_pieces();
                initSelect();
            }
            
            if(input_key_down("r")){
                cleartutorial();
                tutorialsetup();
                tutorial_isAlive=true;
                tutorial_hasWon=false;
            }
            
            // Main tutorial level logic (adapted for animation)
            const playerPos = query_position(current_player);
            const playerSize = query_scale(current_player);
            // Only allow movement if player is alive
            if (tutorial_isAlive && !tutorial_hasWon) {
                // Movement controls
                const left = input_key_down("a");
                const right = input_key_down("d");
                let moving = left || right;
                if (left && !facing_left) {
                    facing_left = true;
                    set_sprite_direction(player_frames, true);
                } else if (right && facing_left) {
                    facing_left = false;
                    set_sprite_direction(player_frames, false);
                }
                if (left) {
                    playerPos[0] = playerPos[0] - TUTORIAL_PLAYER_SPEED;
                }
                if (right) {
                    playerPos[0] = playerPos[0] + TUTORIAL_PLAYER_SPEED;
                }
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
                // Jumping
                if (input_key_down("w") && !tutorial_isJumping) {
                    tutorial_playerVelocityY = TUTORIAL_JUMP_FORCE;
                    tutorial_isJumping = true;
                    jumpSound();
                }
                // Apply gravity
                tutorial_playerVelocityY = tutorial_playerVelocityY + TUTORIAL_GRAVITY;
                playerPos[1] = playerPos[1] + tutorial_playerVelocityY;
                // Platform collision
                if (playerPos[1] > 270) {
                    playerPos[1] = 270;
                    tutorial_playerVelocityY = 0;
                    tutorial_isJumping = false;
                }
                // Screen boundaries
                playerPos[0] = math_max(TUTORIAL_PLAYER_WIDTH/2, math_min(1000 - TUTORIAL_PLAYER_WIDTH/2, playerPos[0]));
            }
            // Update player position and animate
            update_sprite(player_frames, player_frame_index, playerPos);
            // Obstacle collision
            if (gameobjects_overlap(current_player, tutorial_obstacle)) {
                tutorial_isAlive = false;
                update_text(tutorial_statusText, "YOU DIED! Press R to restart or B to go back");
                // Trigger death animation
                const playerPos = query_position(current_player);
                for(let i=1;i<=12;i=i+1){
                    death_piecesVX[i]=(math_random() -0.5)*30;
                    death_piecesVY[i]= (math_random()-1.5)*30; // always upward
                }
                update_position(death_pieces[1],[playerPos[0]-3.5,playerPos[1]-15]);
                update_position(death_pieces[2],[playerPos[0]+2.5,playerPos[1]-9]);
                update_position(death_pieces[3],[playerPos[0]-4,playerPos[1]-13]);
                update_position(death_pieces[4],[playerPos[0],playerPos[1]-5]);
                update_position(death_pieces[5],[playerPos[0]+4,playerPos[1]-6]);
                update_position(death_pieces[6],[playerPos[0]-3.5,playerPos[1]+3]);
                update_position(death_pieces[7],[playerPos[0],playerPos[1]+4]);
                update_position(death_pieces[8],[playerPos[0]+5,playerPos[1]+3]);
                update_position(death_pieces[9],[playerPos[0]+2,playerPos[1]+2]);
                update_position(death_pieces[10],[playerPos[0]-2,playerPos[1]+4]);
                update_position(death_pieces[11],[playerPos[0]+3.5,playerPos[1]+10]);
                update_position(death_pieces[12],[playerPos[0]+3.5,playerPos[1]+14.5]);
                hide_all_frames(player_frames);
                death_animation_active = true;
                deathSound();
            }
            // Door collision (win condition)
            if (gameobjects_overlap(current_player, tutorial_door)) {
                tutorial_hasWon = true;
                update_text(tutorial_statusText, "n-Next Level, r-Restart Level, b-Back");
                update_position(tutorial_statusText, [500, 300]);
                currentState = 0.5;
                victorySound();
            }
            // Update instructions
            update_text(tutorial_instructionText,
                "Controls: W-Jump, S-Crouch, A-Left, D-Right\n" +
                "Avoid the red obstacle. Reach the green door to win!"
            );
        }
    }
    // Animate death pieces and handle restart if dead (tutorial)
    if (currentState === 0 && !tutorial_isAlive) {
        // Animate death pieces if death_animation_active
        if (death_animation_active) {
            let pisPos=[];
            for(let j=1;j<=12;j=j+1){
                pisPos[j]=query_position(death_pieces[j]);
                if(death_pis_on_obj[j]===0){
                    death_piecesVY[j]=death_piecesVY[j]+TUTORIAL_GRAVITY*2;
                    pisPos[j][1]=pisPos[j][1]+death_piecesVY[j];
                }
                pisPos[j][0]=pisPos[j][0]+death_piecesVX[j];
                death_pis_on_obj[j] = 0;
                // Collide with tutorial_platform
                const objPos = query_position(tutorial_platform);
                const objW = TUTORIAL_PLATFORM_WIDTH;
                const objH = TUTORIAL_PLATFORM_HEIGHT;
                if (death_piecesVY[j] >= 0 &&
                    (pisPos[j][1] + death_pieces_H[j]/2>= objPos[1] - objH/2) &&
                    (pisPos[j][1] + death_pieces_H[j]/2 <= objPos[1] - objH/2 + 50) &&
                    (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                    (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                    pisPos[j][1] = objPos[1] - objH/2 - death_pieces_H[j]/2;
                    death_piecesVY[j] = 0;
                    death_pis_on_obj[j] = 1;
                }
                update_position(death_pieces[j],pisPos[j]);
            }
        }
        // On restart, hide all death pieces and reset flag
        if(input_key_down("r")){
            clear_death_pieces();
            cleartutorial();
            tutorialsetup();
            tutorial_isAlive=true;
            tutorial_hasWon=false;
            respawnSound();
        }
        // On back, hide all death pieces, reset flag, and go to select
        if(input_key_down("b")){
            clear_death_pieces();
            currentState = "select";
            cleartutorial();
            initSelect();
        }
        
    }
    if(currentState===6.5){
        // Show 'Next level' message (already set)
        if(input_key_down("r")){
            clearlevel6();
            level6setup();
            currentState=6;
        } 
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_6_5";
        }
        if(input_key_down("n") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "next1_6_5";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_6_5"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 3 && pendingTransition === "next1_6_5"){
            currentState=1;
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_6_5"){
            clearlevel6();
            initSelect();
        }
        if(curtainSequence === 2 && pendingTransition === "next1_6_5"){
            clearlevel6();
            clearlevel1();
            level1setup();
        }
    }
    
    // Level 6 logic
    if(currentState===6){
        // Always allow restart and back to select
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_6";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_6"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_6"){
            clearlevel6();
            clear_death_pieces();
            initSelect();
        }
        if(input_key_down("r")){
            clearlevel6();
            level6setup();
            level6_alive=true;
        }
        if (!level6_alive){
            if (death_animation_active) {
                let pisPos = [];
                for (let j = 1; j <= 12; j = j + 1) {
                    pisPos[j] = query_position(death_pieces[j]);
                    if (death_pis_on_obj[j] === 0) {
                        death_piecesVY[j] = death_piecesVY[j] + GRAVITY * 2;
                        pisPos[j][1] = pisPos[j][1] + death_piecesVY[j];
                    }
                    pisPos[j][0] = pisPos[j][0] + death_piecesVX[j];
                    death_pis_on_obj[j] = 0;
                    // Collide with level 6 ground and door
                    const solids = [level6_ground, level6_door];
                    for (let s = 0; s < array_length(solids); s = s + 1) {
                        const objPos = query_position(solids[s]);
                        const objW = 1200; // ground width or door width
                        const objH = 400;  // ground height or door height
                        // Top collision (piece lands on top of a solid)
                        if (death_piecesVY[j] >= 0 &&
                            (pisPos[j][1] + death_pieces_H[j]/2 >= objPos[1] - objH/2) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 <= objPos[1] - objH/2 + 50) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                            pisPos[j][1] = objPos[1] - objH/2 - death_pieces_H[j]/2;
                            death_piecesVY[j] = 0;
                            death_pis_on_obj[j] = 1;
                        }
                        // Bottom collision (piece hits underside of a solid)
                        if (death_piecesVY[j] < 0 &&
                            (pisPos[j][1] - death_pieces_H[j]/2 <= objPos[1] + objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 >= objPos[1] + objH/2 - 50) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                            pisPos[j][1] = objPos[1] + objH/2 + death_pieces_H[j]/2;
                            death_piecesVY[j] = 0;
                        }
                        // Left collision
                        if (
                            (pisPos[j][0] + death_pieces_W[j]/2 >= objPos[0] - objW/2) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 <= objPos[0] - objW/2 + 50) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                        ) {
                            pisPos[j][0] = objPos[0] - objW/2 - death_pieces_W[j]/2;
                            death_piecesVX[j] = -death_piecesVX[j] * 0.5;
                        }
                        // Right collision
                        else if (
                            (pisPos[j][0] - death_pieces_W[j]/2 <= objPos[0] + objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 >= objPos[0] + objW/2 - 50) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                        ) {
                            pisPos[j][0] = objPos[0] + objW/2 + death_pieces_W[j]/2;
                            death_piecesVX[j] = -death_piecesVX[j] * 0.5;
                        }
                    }
                    update_position(death_pieces[j], pisPos[j]);
                }
            }
            if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
                curtainSequence = 0;
                pendingTransition = "main_from_6";
            }
            if(curtainSequence === 3 && pendingTransition === "main_from_6"){
                currentState="select";
                pendingTransition = null;
            }
            if(curtainSequence === 2 && pendingTransition === "main_from_6"){
                clearlevel6();
                clear_death_pieces();
                initSelect();
            }
            if(input_key_down("r")){
                clearlevel6();
                level6setup();
                level6_alive=true;
            }
        }
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_6";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_6"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_6"){
            clearlevel6();
            clear_death_pieces();
            initSelect();
        }
        if(input_key_down("r")){
            clearlevel6();
            level6setup();
            level6_alive=true;
        }
        if(level6_alive){
            const left = input_key_down("a");
            const right = input_key_down("d");
            const moving = left || right;
            // Player direction
            if (left && !level6_facing_left) {
                level6_facing_left = true;
                level6_set_sprite_direction(level6_player_frames, true);
            } else if (right && level6_facing_left) {
                level6_facing_left = false;
                level6_set_sprite_direction(level6_player_frames, false);
            }
            if (left)  { level6_player_base_pos[0] = level6_player_base_pos[0] - level6_player_move_speed; }
            if (right) { level6_player_base_pos[0] = level6_player_base_pos[0] + level6_player_move_speed; }
            // Player animation
            if (moving) {
                level6_frame_counter = level6_frame_counter + 1;
                if (level6_frame_counter >= LEVEL6_FRAME_DELAY) {
                    level6_frame_counter = 0;
                    level6_player_frame_index = level6_player_frame_index + 1;
                    if (level6_player_frame_index > 3) {level6_player_frame_index = 1; }
                }
            } else {
                level6_player_frame_index = 0;
                level6_frame_counter = 0;
            }
            // Button event
            for (let i = 0; i < LEVEL6_NUM_BUTTONS; i = i + 1) {
                const normal = level6_buttons[i][0];
                const clicked = level6_buttons[i][1];
                const already_clicked = level6_buttons[i][2];
                if (!already_clicked && gameobjects_overlap(level6_current_player, normal)) {
                    level6_buttons[i][2] = true;
                    update_position(normal, [9999, 9999]);
                    update_position(clicked, LEVEL6_button_positions[i]);
                    level6_player_move_speed = math_max(1, level6_player_move_speed - 0.6);
                    LEVEL6_SHAKE_AMPLITUDE = LEVEL6_SHAKE_AMPLITUDE + 2;
                    level6_shakeEnabled = true;
                    level6_totalPressed = level6_totalPressed + 1;
                    if (level6_totalPressed === LEVEL6_NUM_BUTTONS) {
                        level6_door_move_phase = "exit_right";
                        level6_gear_active = true;
                    }
                    buttonClickSound();
                }
            }
            // Door animation
            if (level6_door_move_phase === "exit_right") {
                level6_door_base_pos[0] = level6_door_base_pos[0] + 5;
                if (level6_door_base_pos[0] > 1100) {
                    level6_door_move_phase = "appear_left";
                }
            }
            else if (level6_door_move_phase === "appear_left") {
                level6_door_base_pos[0] = -100;
                level6_door_move_phase = "move_right_to_target";
            }
            else if (level6_door_move_phase === "move_right_to_target") {
                level6_door_base_pos[0] = level6_door_base_pos[0] + 4;
                if (level6_door_base_pos[0] >= LEVEL6_LEFT_DOOR_TARGET[0]) {
                    level6_door_base_pos[0] = LEVEL6_LEFT_DOOR_TARGET[0];
                    level6_door_move_phase = "last";
                }
            }
            else if (level6_door_move_phase === "last" && level6_player_base_pos[0] < 325) {
                level6_door_base_pos[0] = level6_door_base_pos[0] + 2;
            }
            // Gear movement
            if (level6_gear_active) {
                level6_gear_base_pos[0] = level6_gear_base_pos[0] - LEVEL6_GEAR_SPEED;
            }
            const objects = level6_get_all_shakable_objects();
            // restore to base pos
            for (let i = 0; i < array_length(objects); i = i + 1) {
                update_position(objects[i][0], objects[i][1]);
            }
            // calculate shake offset
            let shake_offset = [0, 0];
            if (level6_shakeEnabled) {
                const a = (math_random() * 2 - 1) * LEVEL6_SHAKE_AMPLITUDE;
                shake_offset = [a, a];
            }
            // apply shake offset
            for (let i = 0; i < array_length(objects); i = i + 1) {
                const go = objects[i][0];
                const base = objects[i][1];
                update_position(go, [base[0] + shake_offset[0], base[1] + shake_offset[1]]);
            }
            if (level6_gear_active && gameobjects_overlap(level6_current_player, level6_gear))
            {
                level6_alive = false;
                death_animation_active = true;
                update_text(level6_text, "Game over!");
                deathSound();
            }
            if (gameobjects_overlap(level6_current_player, level6_door))
            {
                level6_alive = false;
                update_text(level6_text, "n-Next Level, r-Restart Level, b-Back");
                const playerPos = query_position(level6_current_player);
                for(let k = 1; k <= 12; k = k + 1){
                    death_piecesVX[k] = (math_random() - 0.5) * 30;
                    death_piecesVY[k] = (math_random() - 1.5) * 30;
                }
                update_position(death_pieces[1], [playerPos[0] - 3.5, playerPos[1] - 15]);
                update_position(death_pieces[2], [playerPos[0] + 2.5, playerPos[1] - 9]);
                update_position(death_pieces[3], [playerPos[0] - 4, playerPos[1] - 13]);
                update_position(death_pieces[4], [playerPos[0], playerPos[1] - 5]);
                update_position(death_pieces[5], [playerPos[0] + 4, playerPos[1] - 6]);
                update_position(death_pieces[6], [playerPos[0] - 3.5, playerPos[1] + 3]);
                update_position(death_pieces[7], [playerPos[0], playerPos[1] + 4]);
                update_position(death_pieces[8], [playerPos[0] + 5, playerPos[1] + 3]);
                update_position(death_pieces[9], [playerPos[0] + 2, playerPos[1] + 2]);
                update_position(death_pieces[10], [playerPos[0] - 2, playerPos[1] + 4]);
                update_position(death_pieces[11], [playerPos[0] + 3.5, playerPos[1] + 10]);
                update_position(death_pieces[12], [playerPos[0] + 3.5, playerPos[1] + 14.5]);
                hide_all_frames(level6_player_frames); // Optionally hide the player sprite
                hide_all_frames(player_frames);
                currentState = 6.5;
                victorySound();
            }
            // render player
            level6_update_sprite(level6_player_frames, level6_player_frame_index, [level6_player_base_pos[0] + shake_offset[0], level6_player_base_pos[1] + shake_offset[1]]);
        }
    }
    // Level 5.5: Wait for user input after finishing level 5
    if(currentState===5.5){
        // Show 'Next level' message (already set)
        if(input_key_down("r")){
            clearlevel5();
            level5setup();
            currentState=5;
        } 
         if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_5_5";
        }
        if(input_key_down("n") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "next6_5_5";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_5_5"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 3 && pendingTransition === "next6_5_5"){
            currentState=6;
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_5_5"){
            clearlevel5();
            initSelect();
        }
        if(curtainSequence === 2 && pendingTransition === "next6_5_5"){
            clearlevel5();
            clearlevel6();
            level6setup();
        }
    }
    
    if(currentState===5){
        // Always allow restart and back to select
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_5";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_5"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_5"){
            clearlevel5();
            clear_death_pieces();
            initSelect();
        }
        if(input_key_down("r")){
            clearlevel5();
            clear_death_pieces();
            level5setup();
            level5_alive=true;
        }
        if (!level5_alive){
            // Animate death pieces if death_animation_active
            if (death_animation_active) {
                let pisPos=[];
                for(let j=1;j<=12;j=j+1){
                    pisPos[j]=query_position(death_pieces[j]);
                    if(death_pis_on_obj[j]===0){
                        death_piecesVY[j]=death_piecesVY[j]+LEVEL5_GRAVITY*2;
                        pisPos[j][1]=pisPos[j][1]+death_piecesVY[j];
                    }
                    pisPos[j][0]=pisPos[j][0]+death_piecesVX[j];
                    death_pis_on_obj[j] = 0;
                    // Collide with any level5_solids
                    for(let s=0;s<array_length(level5_solids);s=s+1){
                        const objPos = query_position(level5_solids[s]);
                        const objW = level5_ws[s];
                        const objH = level5_hs[s];
                        if (death_piecesVY[j] < 0 &&
                            (pisPos[j][1] - death_pieces_H[j]/2 <= objPos[1] + objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 >= objPos[1] + objH/2 - 50) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                            pisPos[j][1] = objPos[1] + objH/2 + death_pieces_H[j]/2;
                            death_piecesVY[j] = 0;
                        }
                        // Top collision (piece lands on top of a solid)
                        if (death_piecesVY[j] >= 0 &&
                            (pisPos[j][1] + death_pieces_H[j]/2 >= objPos[1] - objH/2) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 <= objPos[1] - objH/2 + 50) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                            pisPos[j][1] = objPos[1] - objH/2 - death_pieces_H[j]/2;
                            death_piecesVY[j] = 0;
                            death_pis_on_obj[j] = 1;
                        }
                        // Left collision
                        if (
                            (pisPos[j][0] + death_pieces_W[j]/2 >= objPos[0] - objW/2) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 <= objPos[0] - objW/2 + 50) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                        ) {
                            pisPos[j][0] = objPos[0] - objW/2 - death_pieces_W[j]/2;
                            death_piecesVX[j]= -death_piecesVX[j]*0.5;
                        }
                        // Right collision
                        else if (
                            (pisPos[j][0] - death_pieces_W[j]/2 <= objPos[0] + objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 >= objPos[0] + objW/2 - 50) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                        ) {
                            pisPos[j][0] = objPos[0] + objW/2 + death_pieces_W[j]/2;
                            death_piecesVX[j]= -death_piecesVX[j]*0.5;
                        }
                        }
                        update_position(death_pieces[j],pisPos[j]);
                    }
                }
                // On restart, hide all death pieces and reset flag
                if(input_key_down("r")){
                    clear_death_pieces();
                    clearlevel5();
                    level5setup();
                    level5_alive=true;
                }
                // On back, hide all death pieces, reset flag, and go to select
                if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
                    curtainSequence = 0;
                    pendingTransition = "main_from_5";
                }
                if(curtainSequence === 3 && pendingTransition === "main_from_5"){
                    currentState="select";
                    pendingTransition = null;
                }
                if(curtainSequence === 2 && pendingTransition === "main_from_5"){
                    clearlevel5();
                    clear_death_pieces();
                    initSelect();
                }
            }
            if(level5_alive){
                let playerPos = query_position(current_player);
                const left = input_key_down("a");
                const right = input_key_down("d");
                let moving = left || right;
                if (left && !facing_left) {
                    facing_left = true;
                    set_sprite_direction(player_frames, true);
                } else if (right && facing_left) {
                    facing_left = false;
                    set_sprite_direction(player_frames, false);
                }
                if (left) {
                    playerPos[0] = playerPos[0] - LEVEL5_P_MOVE_V;
                }
                if (right) {
                    playerPos[0] = playerPos[0] + LEVEL5_P_MOVE_V;
                }
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
                // Gravity and jumping
                if(!level5_on_obj){
                    level5_vY=level5_vY+LEVEL5_GRAVITY;
                    playerPos[1]=playerPos[1]+level5_vY;
                }
                if(input_key_down("w")&&level5_on_obj){
                    level5_vY=LEVEL5_JUMP_FORCE;
                    level5_on_obj=false;
                    jumpSound();
                }
                // Trap logic (adapted from suncode.js)
                // --- Begin Level 5 Trap Sequence Logic (restored) ---
                // trap 1 falling
                if(playerPos[0]>=111 && playerPos[1]<=300 && input_key_down("d") && level5_trapSequence===0){
                    level5_trapSequence=1;
                }
                if(level5_trapSequence===1){
                    level5_recoverSequence=0;
                }
                if(level5_recoverSequence===0){
                    update_position(level5_solids[2],[query_position(level5_solids[2])[0],query_position(level5_solids[2])[1]+LEVEL5_FALLING_V]);
                }
                if(query_position(level5_solids[2])[1]>=1800 && level5_recoverSequence===0){
                    level5_recoverSequence=1;
                }
                if(level5_recoverSequence===1){
                    update_position(level5_solids[2],[query_position(level5_solids[2])[0],query_position(level5_solids[2])[1]-LEVEL5_FALLING_V]);
                }
                if(query_position(level5_solids[2])[1]<=348 && level5_recoverSequence===1){
                    update_position(level5_solids[2],[query_position(level5_solids[2])[0],348]);
                    level5_recoverSequence=2;
                }
                // push 1
                if(playerPos[0]>=172 && playerPos[1]<=300 && input_key_down("d") && level5_trapSequence===1){
                    level5_trapSequence=2;
                }
                if(level5_trapSequence===2){
                    update_position(level5_solids[3],[query_position(level5_solids[3])[0],query_position(level5_solids[3])[1]-25]);
                }
                if(query_position(level5_solids[3])[1]<=200 && level5_trapSequence===2){
                    level5_trapSequence=3;
                }
                if(level5_trapSequence===3){
                    update_position(level5_solids[3],[query_position(level5_solids[3])[0]-5,query_position(level5_solids[3])[1]]);
                }
                if(query_position(level5_solids[3])[0]<=174 && level5_trapSequence===3){
                    update_position(level5_solids[3],[174,query_position(level5_solids[3])[1]+6]);
                }
                if(query_position(level5_solids[3])[1]>=350 && level5_trapSequence===3){
                    level5_trapSequence=4;
                }
                // trap 2
                if(playerPos[0]>=222 && playerPos[1]<=300 && input_key_down("d") && level5_trapSequence===4){
                    level5_trapSequence=5; 
                }
                if(level5_trapSequence===5){
                    update_position(level5_solids[5],[query_position(level5_solids[5])[0]+LEVEL5_APPEARING_V,query_position(level5_solids[5])[1]]);
                }
                if(query_position(level5_solids[5])[0]>=362 && level5_trapSequence===5){
                    level5_trapSequence=6;
                }
                if(level5_trapSequence===6){
                    update_position(level5_solids[5],[query_position(level5_solids[5])[0]-LEVEL5_APPEARING_V,query_position(level5_solids[5])[1]]);
                }
                if(query_position(level5_solids[5])[0]<=313 && level5_trapSequence===6){
                    update_position(level5_solids[5],[313,query_position(level5_solids[5])[1]]);
                }
                // push 2 
                if(playerPos[0]>=380 && playerPos[1]<=300 && level5_trapSequence===6){
                    level5_trapSequence=7;
                }
                if(level5_trapSequence===7){
                    update_position(level5_solids[6],[query_position(level5_solids[6])[0],query_position(level5_solids[6])[1]-20]);
                    update_position(level5_solids[5],[query_position(level5_solids[5])[0]+20,query_position(level5_solids[5])[1]]);
                }
                if(query_position(level5_solids[6])[1]<=196 && level5_trapSequence===7){
                    level5_trapSequence=8;
                }
                if(level5_trapSequence===8){
                    update_position(level5_solids[6],[query_position(level5_solids[6])[0]-6,196]);
                }
                if(query_position(level5_solids[6])[0]<=110 && level5_trapSequence===8){
                    level5_trapSequence=9;
                }
                if(level5_trapSequence===9){
                    update_position(level5_solids[6],[110,query_position(level5_solids[6])[1]+LEVEL5_APPEARING_V]);
                    update_position(level5_solids[5],[query_position(level5_solids[5])[0]-10,query_position(level5_solids[5])[1]]);
                }
                if((query_position(level5_solids[6])[1]>=348|| query_position(level5_solids[5])[0]<=313 )&& level5_trapSequence===9){
                    level5_trapSequence=10;
                }
                // trap 4
                if(playerPos[0]>=635 && level5_trapSequence===10){
                    level5_trapSequence=11;
                }
                if(level5_trapSequence===11){
                    update_position(level5_solids[10],[query_position(level5_solids[10])[0]+LEVEL5_TRANSLATING_V,query_position(level5_solids[10])[1]]);
                }
                if(query_position(level5_solids[10])[0]>=800 && level5_trapSequence===11){
                    level5_gametime=get_game_time();
                    level5_trapSequence=12;
                }
                // trap 3 falling
                if(playerPos[0]>=600 && level5_trapSequence===12){
                    level5_trapSequence=13;
                }
                if(level5_trapSequence===13 && get_game_time()-level5_gametime>=500){
                    update_position(level5_solids[8],[query_position(level5_solids[8])[0],query_position(level5_solids[8])[1]+LEVEL5_FALLING_V]);
                }
                if(query_position(level5_solids[8])[1]>=1000 && level5_trapSequence===13){
                    level5_trapSequence=14;
                }
                if(level5_trapSequence===14){
                    update_position(level5_solids[8],[query_position(level5_solids[8])[0],query_position(level5_solids[8])[1]-LEVEL5_FALLING_V]);
                }
                if(query_position(level5_solids[8])[1]<=348 && level5_trapSequence===14){
                    level5_trapSequence=15;
                }
                // block
                if(playerPos[0]>=680 && playerPos[1]<=300 && level5_trapSequence===15){
                    level5_trapSequence=16;
                }
                if(level5_trapSequence===16){
                    update_position(level5_solids[9],[query_position(level5_solids[9])[0],query_position(level5_solids[9])[1]-2*LEVEL5_APPEARING_V]);
                }
                if(query_position(level5_solids[9])[1]<=200 && level5_trapSequence===16){
                    level5_gametime=get_game_time();
                    level5_trapSequence=17;
                }
                if(level5_trapSequence===17&& get_game_time()-level5_gametime>=1000){
                    level5_trapSequence=17.5;
                }
                if(level5_trapSequence===17.5){
                    update_position(level5_solids[9],[query_position(level5_solids[9])[0],query_position(level5_solids[9])[1]+LEVEL5_APPEARING_V]);
                }
                if(query_position(level5_solids[9])[1]>=324 && level5_trapSequence===17.5){
                    level5_trapSequence=18;
                }
                // trap 5
                if(playerPos[0]>=870 && playerPos[1]<=300 && level5_trapSequence===18){
                    level5_trapSequence=19;
                }
                if(level5_trapSequence===19){
                    update_position(level5_solids[12],[query_position(level5_solids[12])[0]+LEVEL5_TRANSLATING_V,query_position(level5_solids[12])[1]]);
                    update_position(level5_door,[query_position(level5_door)[0]+LEVEL5_TRANSLATING_V,query_position(level5_door)[1]]);
                }
                if(query_position(level5_solids[12])[0]>=970 && level5_trapSequence===19){
                    update_position(level5_solids[12],[968,query_position(level5_solids[12])[1]]);
                    update_position(level5_door,[968,query_position(level5_door)[1]]);
                    level5_trapSequence=20;
                }
        // --- End Level 5 Trap Sequence Logic ---
                // Reset on_obj before checking collisions
                level5_on_obj = false;
                let on_object_check = 0;
                for (let i = 0; i < 13; i = i + 1) {
                    const objPos = query_position(level5_solids[i]);
                    const objW = level5_ws[i];
                    const objH = level5_hs[i];
                    // Top collision (player lands on solid)
                    if (!level5_on_obj && level5_vY >= 0 &&
                        (playerPos[1] + LEVEL5_P_HEIGHT/2 >= objPos[1] - objH/2) &&
                        (playerPos[1] + LEVEL5_P_HEIGHT/2 <= objPos[1] - objH/2 + 50) &&
                        (playerPos[0] + LEVEL5_P_WIDTH/2 > objPos[0] - objW/2) &&
                        (playerPos[0] - LEVEL5_P_WIDTH/2 < objPos[0] + objW/2)) {
                        playerPos[1] = objPos[1] - objH/2 - LEVEL5_P_HEIGHT/2;
                        level5_vY = 0;
                        level5_on_obj = true;
                        on_object_check = 1;
                    }
                    // Bottom collision (player jumps and hits bottom of solid)
                    else if (level5_vY < 0 &&
                        (playerPos[1] - LEVEL5_P_HEIGHT/2 <= objPos[1] + objH/2) &&
                        (playerPos[1] - LEVEL5_P_HEIGHT/2 >= objPos[1] + objH/2 - 50) &&
                        (playerPos[0] + LEVEL5_P_WIDTH/2 > objPos[0] - objW/2) &&
                        (playerPos[0] - LEVEL5_P_WIDTH/2 < objPos[0] + objW/2)) {
                        playerPos[1] = objPos[1] + objH/2 + LEVEL5_P_HEIGHT/2;
                        level5_vY = 0;
                    }
                    // Left collision (player runs into right side of solid)
                    if (
                        (playerPos[0] + LEVEL5_P_WIDTH/2 >= objPos[0] - objW/2) &&
                        (playerPos[0] + LEVEL5_P_WIDTH/2 <= objPos[0] - objW/2 + 20) &&
                        (playerPos[1] + LEVEL5_P_HEIGHT/2 > objPos[1] - objH/2) &&
                        (playerPos[1] - LEVEL5_P_HEIGHT/2 < objPos[1] + objH/2)
                    ) {
                        playerPos[0] = objPos[0] - objW/2 - LEVEL5_P_WIDTH/2;
                    }
                    // Right collision (player runs into left side of solid)
                    else if (
                        (playerPos[0] - LEVEL5_P_WIDTH/2 <= objPos[0] + objW/2) &&
                        (playerPos[0] - LEVEL5_P_WIDTH/2 >= objPos[0] + objW/2 - 40) &&
                        (playerPos[1] + LEVEL5_P_HEIGHT/2 > objPos[1] - objH/2) &&
                        (playerPos[1] - LEVEL5_P_HEIGHT/2 < objPos[1] + objH/2)
                    ) {
                        playerPos[0] = objPos[0] + objW/2 + LEVEL5_P_WIDTH/2;
                    }
                }
                for (let i = 0; i < array_length(player_frames); i = i + 1) {
                    update_position(player_frames[i], playerPos);
                }
                // Set current_player to the correct frame for this tick
                current_player = player_frames[player_frame_index];
                update_sprite(player_frames, player_frame_index, playerPos);
                if(on_object_check !== 1){
                    level5_on_obj = false;
                }
                if(gameobjects_overlap(current_player,level5_door)){
                    update_position(current_player,[968,211]);
                    // Level complete, show completion message
                    update_position(collision_happened, [500, 300]);
                    update_text(collision_happened, "n-Next Level, r-Restart Level, b-Back");
                    currentState=5.5;
                    victorySound();
                }
                // --- Death by falling below screen ---
                if(playerPos[1]>=600){
                    level5_alive=false;
                    // Trigger death animation for level 5
                    for(let k=1;k<=12;k=k+1){
                        death_piecesVX[k]=(math_random() -0.5)*30;
                        death_piecesVY[k]= (math_random()-1.5)*30;
                    }
                    update_position(death_pieces[1],[playerPos[0]-3.5,playerPos[1]-15]);
                    update_position(death_pieces[2],[playerPos[0]+2.5,playerPos[1]-9]);
                    update_position(death_pieces[3],[playerPos[0]-4,playerPos[1]-13]);
                    update_position(death_pieces[4],[playerPos[0],playerPos[1]-5]);
                    update_position(death_pieces[5],[playerPos[0]+4,playerPos[1]-6]);
                    update_position(death_pieces[6],[playerPos[0]-3.5,playerPos[1]+3]);
                    update_position(death_pieces[7],[playerPos[0],playerPos[1]+4]);
                    update_position(death_pieces[8],[playerPos[0]+5,playerPos[1]+3]);
                    update_position(death_pieces[9],[playerPos[0]+2,playerPos[1]+2]);
                    update_position(death_pieces[10],[playerPos[0]-2,playerPos[1]+4]);
                    update_position(death_pieces[11],[playerPos[0]+3.5,playerPos[1]+10]);
                    update_position(death_pieces[12],[playerPos[0]+3.5,playerPos[1]+14.5]);
                    hide_all_frames(player_frames);
                    death_animation_active = true;
                    deathSound();
                }
            }
        }

    // Level 4.5: Wait for user input after finishing level 4
    if(currentState===4.5){
        // Show 'Next level' message (already set)
        if(input_key_down("r")){
            clearlevel4();
            level4setup();
            currentState=4;
        } 
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_4_5";
        }
        if(input_key_down("n") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "next5_4_5";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_4_5"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 3 && pendingTransition === "next5_4_5"){
            currentState=5;
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_4_5"){
            clearlevel4();
            initSelect();
        }
        if(curtainSequence === 2 && pendingTransition === "next5_4_5"){
            clearlevel4();
            clearlevel5();
            level5setup();
        }
    }
    
    if(currentState===4){
        if (!alive){
            if(input_key_down("b")){
                currentState="select";
                clearlevel4();
                initSelect();
            }
            if(input_key_down("r")){
                clearlevel4();
                level4setup();
                alive=true;
            }
        }
        
        //Player return to Select Screen
        if(input_key_down("b")){
            update_text(collision_happened, "");
            currentState="select";
            clearlevel4();
            initSelect();
        }
        
        if(input_key_down("r")){
            clearlevel4();
            level4setup();
            alive=true;
        }
        
        if(alive){
            //Player jump
           const playerPos = query_position(player);
           if(trapSequence!==3 && trapSequence!==2 && trapSequence!==4){
                if (input_key_down("a")) {
                    playerPos[0] = playerPos[0] - PLAYER_MOVE_SPEED;
                }
                if (input_key_down("d")) {
                    playerPos[0] = playerPos[0] + PLAYER_MOVE_SPEED;
                }
                if(!on_object){
                    velocityY = velocityY + GRAVITY;
                    playerPos[1] = playerPos[1] + velocityY;
                }
                if (input_key_down("w") && on_object) {
                    tryjump = true;
                    velocityY = JUMP_FORCE;
                    on_object = false;
                }
           }
           else{
               if (input_key_down("d")) {
                    playerPos[0] = playerPos[0] - PLAYER_MOVE_SPEED;
                }
                if (input_key_down("a")) {
                    playerPos[0] = playerPos[0] + PLAYER_MOVE_SPEED;
                }
                if(!on_object){
                    velocityY = velocityY + GRAVITY;
                    playerPos[1] = playerPos[1] + velocityY;
                }
                if (input_key_down("s") && on_object ) {
                    tryjump = true;
                    velocityY = JUMP_FORCE;
                    on_object = false;
                }
           }
            debug_log("jump check");
            debug_log("on_object check: "+stringify(on_object));
            const currentPlayerHeight =PLAYER_HEIGHT;
            debug_log("trapSequence: "+stringify(trapSequence));
            
            //First expansion
            if(trapSequence===0){
                if(query_scale(player)[0]>=5){
                    trapSequence=1;
                }
                else if(query_scale(player)[0]<5 && query_scale(player)[0]>1){
                    update_scale(player,[query_scale(player)[0]+0.5,query_scale(player)[1]+0.5]);
                }
                else if(gameobjects_overlap(buttons[0],player)){
                    update_scale(player,[1.5,1.5]);
                }
            }
            
            if(trapSequence===1){
                if(query_scale(player)[0]<=0.5){
                    trapSequence=2;
                }
                else if(query_scale(player)[0]<5 && query_scale(player)[0]>0.5){
                    update_scale(player,[query_scale(player)[0]-1,query_scale(player)[1]-1]);
                }
                else if(gameobjects_overlap(buttons[1],player)){
                    update_scale(player,[4.5,4.5]);
                }
            }
            
            if(trapSequence===2){
                if(query_position(game_solids[0])[0]<=50){
                    trapSequence=3;
                }
                else if(query_scale(player)[0]===0.5){
                    update_position(game_solids[0],[query_position(game_solids[0])[0]-SPIKES_MOVE_SPEED,600]);
                }
            }
            
            if(trapSequence===3){
                if(query_position(game_solids[9])[1]<602 && query_position(game_solids[9])[1]>0){
                    trapSequence=4;
                }
                else if(query_position(game_solids[9])[1]>=602){
                    update_position(game_solids[9],[500,query_position(game_solids[9])[1]-SPIKES_MOVE_SPEED*2]);
                }
                else if(playerPos[0]<=300){
                    update_position(game_solids[9],[500,1000]);
                }
            }
            
            if(trapSequence===4){
                if(gameobjects_overlap(buttons[3],player)){
                    trapSequence=5;
                }
                else if(query_scale(player)[0]>0.5 && query_position(buttons[3])[1]>530){
                    update_scale(player,[query_scale(player)[0]+0.25,query_scale(player)[1]+0.25]);
                    update_position(buttons[3],[500,query_position(buttons[3])[1]-SPIKES_MOVE_SPEED]);
                }
                else if(query_scale(player)[0]>0.5){
                    update_scale(player,[query_scale(player)[0]+0.25,query_scale(player)[1]+0.25]);
                }
                else if(gameobjects_overlap(buttons[2],player)){
                    update_scale(player,[1,1]);
                    
                }
            }
            
            if(trapSequence===5){
                if(query_scale(player)[0]>1){
                    update_scale(player,[query_scale(player)[0]-0.25,query_scale(player)[1]-0.25]);
                }
            }
            // Update GameObjects within update_loop(...)
            let on_object_check=0;
            for (let i = 0; i < objos_list_size; i = i + 1) {
                const ob = game_solids[objos_list[i]];
                const ob_pos=query_position(ob);
                if (!tryjump && (playerPos[1] + currentPlayerHeight*query_scale(player)[1]/2 >= ob_pos[1]-50*query_scale(ob)[1]) && (playerPos[1] + currentPlayerHeight/2 - ob_pos[1]+50*query_scale(ob)[1]<= 50) && (playerPos[0] + PLAYER_WIDTH/2 > ob_pos[0]-50*query_scale(ob)[0]) && (playerPos[0] - PLAYER_WIDTH/2 < ob_pos[0]+50*query_scale(ob)[0])) {
                    playerPos[1] = ob_pos[1] - 50*query_scale(ob)[1] - currentPlayerHeight*query_scale(player)[1]/2;
                    velocityY = 0;
                    on_object = true;
                    on_object_check=1;
                }
                else if((playerPos[1] - currentPlayerHeight*query_scale(player)[1]/2 <= ob_pos[1] + 50*query_scale(ob)[1]) && (playerPos[1] - currentPlayerHeight/2 - ob_pos[1] - 50*query_scale(ob)[1]>= -25) && (playerPos[0] + PLAYER_WIDTH/2 > ob_pos[0] - 50*query_scale(ob)[0]) && (playerPos[0] - PLAYER_WIDTH/2 < ob_pos[0] + 50*query_scale(ob)[0])){
                    playerPos[1] =ob_pos[1] + 50*query_scale(ob)[1] + currentPlayerHeight*query_scale(player)[1]/2;
                    velocityY = 0;
                    on_object=false;
                }
                if((playerPos[0] + PLAYER_WIDTH*query_scale(player)[0]/2 >= ob_pos[0]-50*query_scale(ob)[0]) && (playerPos[0] + PLAYER_WIDTH/2 - ob_pos[0] + 65*query_scale(ob)[0] <= 25) && (playerPos[1] + currentPlayerHeight/2 > ob_pos[1] - 50*query_scale(ob)[1]) && (playerPos[1] - currentPlayerHeight/2 < ob_pos[1] +50*query_scale(ob)[1])){
                    playerPos[0] = ob_pos[0] - 50*query_scale(ob)[0] - PLAYER_WIDTH*query_scale(player)[0]/2;
                }
                else if((playerPos[0] - PLAYER_WIDTH*query_scale(player)[0]/2 <= ob_pos[0]+50*query_scale(ob)[0]) && (playerPos[0] - PLAYER_WIDTH/2 - ob_pos[0] - 65*query_scale(ob)[0]>= -25) && (playerPos[1] + currentPlayerHeight/2 > ob_pos[1] - 50*query_scale(ob)[1]) && (playerPos[1] - currentPlayerHeight/2 < ob_pos[1] +50*query_scale(ob)[1])){
                    playerPos[0] = ob_pos[0] + 50*query_scale(ob)[0] + PLAYER_WIDTH*query_scale(player)[0]/2;
                }
            }
            if(on_object_check!==1){
                on_object_check=0;
                on_object=false;
            }
            
            update_position(player, playerPos); // Still update after push
            if (tryjump) {
                tryjump=false;
            }
            
            for(let i=0;i<20;i=i+1){
                if (gameobjects_overlap(player, game_traps[i])) {
                    update_position(collision_happened, [500, 300]);
                    update_text(collision_happened, "Game Over!");
                    alive = false;
                }
            }
            
            if (gameobjects_overlap(player, door))
            {
                update_position(collision_happened, [500, 300]);
                update_text(collision_happened, "Next level");
                currentState=4.5;
            }
            
            // Place blocks over traps if overlapping
            for (let i = 0; i < 33; i=i+1) { // 33 game_solids
                for (let j = 0; j < 30; j=j+1) { // 30 game_traps
                    if (gameobjects_overlap(game_solids[i], game_traps[j])) {
                        update_to_top(game_solids[i]);
                    }
                }
            }
            debug_log("game_solids[0] pos: "+stringify(query_position(game_solids[0])));
            debug_log("game_solids[6] pos: "+stringify(query_position(game_solids[6])));
            debug_log("door position: "+stringify(query_position(door)));
           debug_log("player position:"+stringify(query_position(player)));
        }
    }
    // Level 3.5: Wait for user input after finishing level 3
    if(currentState===3.5){
        // Show 'Next level' message (already set)
        if(input_key_down("r")){
            clearlevel3();
            level3setup();
            currentState=3;
        } else if(input_key_down("b")){
            clearlevel3();
            initSelect();
            currentState="select";
        } else if(input_key_down("n")){
            clearlevel3();
            clearlevel2();
            clearlevel1(); // Ensure player and door are reset
            level4setup();
            currentState=4;
        }
    }
    // Level 3.5: Wait for user input after finishing level 3
    if(currentState===3.5){
        // Show 'Next level' message (already set)
        if(input_key_down("r")){
            clearlevel3();
            level3setup();
            currentState=3;
        } 
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_3";
        }
        if(input_key_down("n") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "next4";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_3"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 3 && pendingTransition === "next4"){
            currentState=4;
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_3"){
            clearlevel3();
            initSelect();
        }
        if(curtainSequence === 2 && pendingTransition === "next4"){
            clearlevel3();
            clearlevel2();
            clearlevel1();
            level4setup();
        }
    }
    
    if(currentState===3){
        if (!alive){
            if (death_animation_active) {
                    let pisPos=[];
                    for(let j=1;j<=12;j=j+1){
                        pisPos[j]=query_position(death_pieces[j]);
                        if(death_pis_on_obj[j]===0){
                            death_piecesVY[j]=death_piecesVY[j]+GRAVITY*2;
                            pisPos[j][1]=pisPos[j][1]+death_piecesVY[j];
                        }
                        pisPos[j][0]=pisPos[j][0]+death_piecesVX[j];
                        death_pis_on_obj[j] = 0;
                        // Collide with any game_solid
                        for(let s=0;s<array_length(game_solids);s=s+1){
                            const objPos = query_position(game_solids[s]);
                            const objW = 100*query_scale(game_solids[s])[0];
                            const objH = 100*query_scale(game_solids[s])[1];
                            if (death_piecesVY[j] < 0 &&
                            (pisPos[j][1] - death_pieces_H[j]/2 <= objPos[1] + objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 >= objPos[1] + objH/2 - 50) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                            pisPos[j][1] = objPos[1] + objH/2 + death_pieces_H[j]/2;
                            death_piecesVY[j] = 0;
                        }
                        // Top collision (piece lands on top of a solid)
                        if (death_piecesVY[j] >= 0 &&
                            (pisPos[j][1] + death_pieces_H[j]/2 >= objPos[1] - objH/2) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 <= objPos[1] - objH/2 + 50) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                            pisPos[j][1] = objPos[1] - objH/2 - death_pieces_H[j]/2;
                            death_piecesVY[j] = 0;
                            death_pis_on_obj[j] = 1;
                        }
                        // Left collision
                        if (
                            (pisPos[j][0] + death_pieces_W[j]/2 >= objPos[0] - objW/2) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 <= objPos[0] - objW/2 + 50) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                        ) {
                            pisPos[j][0] = objPos[0] - objW/2 - death_pieces_W[j]/2;
                            death_piecesVX[j]= -death_piecesVX[j]*0.5;
                        }
                        // Right collision
                        else if (
                            (pisPos[j][0] - death_pieces_W[j]/2 <= objPos[0] + objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 >= objPos[0] + objW/2 - 50) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                        ) {
                            pisPos[j][0] = objPos[0] + objW/2 + death_pieces_W[j]/2;
                            death_piecesVX[j]= -death_piecesVX[j]*0.5;
                        }
                        }
                        update_position(death_pieces[j],pisPos[j]);
                    }
                }
            if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
                curtainSequence = 0;
                pendingTransition = "main_from_3";
            }
            if(curtainSequence === 3 && pendingTransition === "main_from_3"){
                currentState="select";
                pendingTransition = null;
            }
            if(curtainSequence === 2 && pendingTransition === "main_from_3"){
                clearlevel3();
                clear_death_pieces();
                initSelect();
            }
            if(input_key_down("r")){
                clearlevel3();
                clear_death_pieces();
                level3setup();
                alive=true;
            }
        }
        
        //Player return to Select Screen
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_3";
        }

        if(curtainSequence === 3 && pendingTransition === "main_from_3"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_3"){
            clearlevel3();
            clear_death_pieces();
            initSelect();
        }
        
        if(input_key_down("r")){
            clearlevel3();
            clear_death_pieces();
            level3setup();
            alive=true;
        }
        
        if(alive){
            //Player jump
            let playerPos = query_position(current_player);
            const left = input_key_down("a");
            const right = input_key_down("d");
            let moving = left || right;
            if (left && !facing_left) {
                facing_left = true;
                set_sprite_direction(player_frames, true);
            } else if (right && facing_left) {
                facing_left = false;
                set_sprite_direction(player_frames, false);
            }
            if (left) {
                playerPos[0] = playerPos[0] - PLAYER_MOVE_SPEED;
            }
            if (right) {
                playerPos[0] = playerPos[0] + PLAYER_MOVE_SPEED;
            }
            if (moving) {
                frame_counter = frame_counter + 1;
                if (frame_counter >= FRAME_DELAY) {
                    frame_counter = 0;
                    player_frame_index = player_frame_index + 1;
                    if (player_frame_index > 3) {
                        player_frame_index = 1; // idle = 0; running = 1 ~ 3
                    }
                }
            } else {
                player_frame_index = 0;
                frame_counter = 0;
            }
            if(!on_object){
                velocityY = velocityY + GRAVITY;
                playerPos[1] = playerPos[1] + velocityY;
            }
            if (input_key_down("w") && on_object && trapSequence!==2) {
                tryjump = true;
                velocityY = JUMP_FORCE;
                on_object = false;
                jumpSound();
            }
            debug_log("jump check");
            debug_log("on_object check: "+stringify(on_object));
            const currentPlayerHeight = PLAYER_HEIGHT;
            debug_log("trapSequence: "+stringify(trapSequence));
            
            //Moving Purple
            if(trapSequence===0 && playerPos[0]>=120 && input_key_down("w")){
                trapSequence=1;
            }
            if(trapSequence===1 && query_position(game_solids[32])[1]<=200){
                trapSequence=2;
            }
            else if(trapSequence===1 && query_position(game_solids[32])[1]<=270){
                update_position(game_solids[32],[query_position(game_solids[32])[0],query_position(game_solids[32])[1]-SPIKES_MOVE_SPEED/1.5]);
            }
            else if(trapSequence===1 && query_position(game_traps[1])[1]>=-10 &&query_position(game_solids[32])[1]>=310 && query_position(game_solids[32])[1]<=340){
                update_position(game_traps[1],[query_position(game_traps[1])[0],query_position(game_traps[1])[1]+SPIKES_MOVE_SPEED]);
                update_position(game_solids[32],[query_position(game_solids[32])[0],query_position(game_solids[32])[1]-SPIKES_MOVE_SPEED/1.5]);
            }
            else if(trapSequence===1 && query_position(game_solids[32])[1]<=340 && query_position(game_traps[1])[1]<-10){
                update_position(game_traps[1],[255,-10]);
                update_position(game_solids[32],[query_position(game_solids[32])[0],query_position(game_solids[32])[1]-SPIKES_MOVE_SPEED/1.5]);
            }
            else if(trapSequence===1){
                update_position(game_solids[32],[query_position(game_solids[32])[0],query_position(game_solids[32])[1]-SPIKES_MOVE_SPEED/1.5]);
            }
            if (trapSequence === 2) {
                // Check if player is on top of game_solids[8]
                const solid8Pos = query_position(game_solids[8]);
                const solid8Scale = query_scale(game_solids[8]);
                // Check if player is on top (within X bounds and just above Y)
                if (
                    playerPos[0] + PLAYER_WIDTH/2 > solid8Pos[0] - 50 * solid8Scale[0] &&
                    playerPos[0] - PLAYER_WIDTH/2 < solid8Pos[0] + 50 * solid8Scale[0] &&
                    math_abs((playerPos[1] + PLAYER_HEIGHT/2) - (solid8Pos[1] - 50 * solid8Scale[1])) < 5
                ) {
                    // Place transportDoor hovering above game_solids[9]
                    const solid9Pos = query_position(game_solids[9]);
                    update_position(transportDoor, [solid9Pos[0], solid9Pos[1] - 30]);
                }
                // If player overlaps with transportDoor, teleport and advance sequence
                if (gameobjects_overlap(current_player, transportDoor)) {
                    // Place player underneath game_solids[2]
                    trapSequence = 3;
                }
            }
            if (trapSequence===3){
                if(playerPos[1]<=100){
                    const solid2Pos = query_position(game_solids[2]);
                    update_position(current_player, [solid2Pos[0], solid2Pos[1] + 70]);
                    update_position(transportDoor, [-500, -500]);
                }
            }
            // Update GameObjects within update_loop(...)
            let on_object_check=0;
            debug_log("position of purple: "+stringify(query_position(game_solids[objos_list[12]])));
            for (let i = 0; i < objos_list_size; i = i + 1) {
                const ob = game_solids[objos_list[i]];
                const ob_pos=query_position(ob);
                if (!tryjump && (playerPos[1] + currentPlayerHeight/2 >= ob_pos[1]-50*query_scale(ob)[1]) && (playerPos[1] + currentPlayerHeight/2 - ob_pos[1]+50*query_scale(ob)[1]<= 50) && (playerPos[0] + PLAYER_WIDTH/2 > ob_pos[0]-50*query_scale(ob)[0]) && (playerPos[0] - PLAYER_WIDTH/2 < ob_pos[0]+50*query_scale(ob)[0])) {
                    playerPos[1] = ob_pos[1] - 50*query_scale(ob)[1] - currentPlayerHeight/2;
                    if(i===12){
                        velocityY = JUMP_FORCE*2;
                        on_object = false;
                        jumpSound();
                    }
                    else{
                        velocityY = 0;
                        on_object = true;
                        on_object_check=1;
                    }
                }
                else if((playerPos[1] - currentPlayerHeight/2 <= ob_pos[1] + 50*query_scale(ob)[1]) && (playerPos[1] - currentPlayerHeight/2 - ob_pos[1] - 50*query_scale(ob)[1]>= -25) && (playerPos[0] + PLAYER_WIDTH/2 > ob_pos[0]-50*query_scale(ob)[0]) && (playerPos[0] - PLAYER_WIDTH/2 < ob_pos[0]+50*query_scale(ob)[0])){
                    playerPos[1] =ob_pos[1] + 50*query_scale(ob)[1] + currentPlayerHeight/2;
                    velocityY = 0;
                    on_object=false;
                }
                if((playerPos[0] + PLAYER_WIDTH/2 >= ob_pos[0]-50*query_scale(ob)[0]) && (playerPos[0] + PLAYER_WIDTH/2 - ob_pos[0] + 50*query_scale(ob)[0] <= 25) && (playerPos[1] + currentPlayerHeight/2 > ob_pos[1] - 50*query_scale(ob)[1]) && (playerPos[1] - currentPlayerHeight/2 < ob_pos[1] +50*query_scale(ob)[1])){
                    playerPos[0] = ob_pos[0] - 50*query_scale(ob)[0] - PLAYER_WIDTH/2;
                }
                else if((playerPos[0] - PLAYER_WIDTH/2 <= ob_pos[0]+50*query_scale(ob)[0]) && (playerPos[0] - PLAYER_WIDTH/2 - ob_pos[0] - 50*query_scale(ob)[0]>= -25) && (playerPos[1] + currentPlayerHeight/2 > ob_pos[1] - 50*query_scale(ob)[1]) && (playerPos[1] - currentPlayerHeight/2 < ob_pos[1] +50*query_scale(ob)[1])){
                    playerPos[0] = ob_pos[0] + 50*query_scale(ob)[0] + PLAYER_WIDTH/2;
                }
            }
            if(on_object_check!==1){
                on_object_check=0;
                on_object=false;
            }
            
            update_sprite(player_frames, player_frame_index, playerPos); // Animate sprite
            if (tryjump) {
                tryjump=false;
            }
            
            // ... existing movement and collision logic ...
            // Death by trap (level 3)
            for(let i=0;i<20;i=i+1){
                if (gameobjects_overlap(current_player, game_traps[i])) {
                    update_position(collision_happened, [500, 300]);
                    update_text(collision_happened, "Game Over!");
                    alive = false;
                    // Trigger death animation for level 3
                    const playerPos = query_position(current_player);
                    for(let k=1;k<=12;k=k+1){
                        death_piecesVX[k]=(math_random() -0.5)*30;
                        death_piecesVY[k]= (math_random()-1.5)*30;
                    }
                    update_position(death_pieces[1],[playerPos[0]-3.5,playerPos[1]-15]);
                    update_position(death_pieces[2],[playerPos[0]+2.5,playerPos[1]-9]);
                    update_position(death_pieces[3],[playerPos[0]-4,playerPos[1]-13]);
                    update_position(death_pieces[4],[playerPos[0],playerPos[1]-5]);
                    update_position(death_pieces[5],[playerPos[0]+4,playerPos[1]-6]);
                    update_position(death_pieces[6],[playerPos[0]-3.5,playerPos[1]+3]);
                    update_position(death_pieces[7],[playerPos[0],playerPos[1]+4]);
                    update_position(death_pieces[8],[playerPos[0]+5,playerPos[1]+3]);
                    update_position(death_pieces[9],[playerPos[0]+2,playerPos[1]+2]);
                    update_position(death_pieces[10],[playerPos[0]-2,playerPos[1]+4]);
                    update_position(death_pieces[11],[playerPos[0]+3.5,playerPos[1]+10]);
                    update_position(death_pieces[12],[playerPos[0]+3.5,playerPos[1]+14.5]);
                    hide_all_frames(player_frames);
                    death_animation_active = true;
                    deathSound();
                }
            }
            
            if (gameobjects_overlap(current_player, door))
            {
                update_position(collision_happened, [500, 300]);
                update_text(collision_happened, "n-Next Level, r-Restart Level, b-Back");
                currentState=3.5;
                victorySound();
            }
            
            if(trapSequence===4){
                const tdpos=query_position(transportDoor);
                if(tdpos[0]>=700){
                    //nothing
                }
                else if(tdpos[0]>=255){
                    update_position(transportDoor, [tdpos[0]+SPIKES_MOVE_SPEED/1.35, 530]);
                }
                if(gameobjects_overlap(current_player,transportDoor)){
                    update_position(current_player,[playerPos[0],playerPos[1]-300]);
                    velocityY=0;
                }
            }
            
            if (trapSequence===3){
                if(playerPos[1]<=100){
                    const solid2Pos = query_position(game_solids[2]);
                    update_position(current_player, [solid2Pos[0]-100, solid2Pos[1] + 50]);
                    update_position(transportDoor, [255, 530]);
                    trapSequence=4;
                }
            }
            // Place blocks over traps if overlapping
            for (let i = 0; i < 33; i=i+1) { // 33 game_solids
                for (let j = 0; j < 30; j=j+1) { // 30 game_traps
                    if (gameobjects_overlap(game_solids[i], game_traps[j])) {
                        update_to_top(game_solids[i]);
                    }
                }
            }
            debug_log("game_solids[0] pos: "+stringify(query_position(game_solids[0])));
            debug_log("game_solids[6] pos: "+stringify(query_position(game_solids[6])));
            debug_log("door position: "+stringify(query_position(door)));
           debug_log("player position:"+stringify(query_position(current_player)));
        }
    }

    // Level 2.5: Wait for user input after finishing level 2
    if(currentState===2.5){
        // Show 'Next level' message (already set)
        if(input_key_down("r")){
            clearlevel2();
            level2setup();
            currentState=2;
        } 
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_2";
        }
        if(input_key_down("n") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "next3";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_2"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 3 && pendingTransition === "next3"){
            currentState=3;
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_2"){
            clearlevel2();
            initSelect();
        }
        if(curtainSequence === 2 && pendingTransition === "next3"){
            clearlevel2();
            level3setup();
        }
    }
    
    if(currentState===2){
        // Always allow restart and back to select
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_2";
        }

        if(curtainSequence === 3 && pendingTransition === "main_from_2"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_2"){
            clearlevel2();
            clear_death_pieces();
            initSelect();
        }
        if(input_key_down("r")){
            clearlevel2();
            clear_death_pieces();
            level2setup();
        }
        if (gameOver2 || gameWon2) {
            if(input_key_down("b")){
                currentState="select";
                clearlevel2();
                clear_death_pieces();
                initSelect();
            }
            if(input_key_down("r")){
                clearlevel2();
                clear_death_pieces();
                level2setup();
            }
        }
        //Player return to Select Screen
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_2";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_2"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_2"){
            clearlevel2();
            clear_death_pieces();
            initSelect();
        }
        if(input_key_down("r")){
            clearlevel2();
            clear_death_pieces();
            level2setup();
        }
        if(!(gameOver2 || gameWon2)){
            // Level 2 main logic (restored, using current_player for all logic)
            let playerPos = query_position(current_player);
            const platformPos = query_position(platform2);
            const obstaclePos = query_position(obstacle2);
            const doorPos = query_position(door2);
            const trap1Pos = query_position(trap2_1);
            const trap2Pos = query_position(trap2_2);
            const traps1Pos = query_position(traps2_1);
            const traps21Pos = query_position(traps2_21);
            const traps22Pos = query_position(traps2_22);
            // Movement and animation
            const left = input_key_down("a");
            const right = input_key_down("d");
            let moving = left || right;
            if (left && !facing_left) {
                facing_left = true;
                set_sprite_direction(player_frames, true);
            } else if (right && facing_left) {
                facing_left = false;
                set_sprite_direction(player_frames, false);
            }
            if (left) {
                playerPos[0] = playerPos[0] - PLAYER2_SPEED;
            }
            if (right) {
                playerPos[0] = playerPos[0] + PLAYER2_SPEED;
            }
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
            // Trap and button logic (unchanged)
            // ... (copy original Level 2 logic for traps, buttons, blocks, and platform collision, but use current_player and playerPos) ...
            // Gravity and upside-down logic
            velocityY2 = velocityY2 + (isUpsideDown2 ? -GRAVITY2 : GRAVITY2);
            // Horizontal movement and obstacle collision
            let intendedX = playerPos[0];
            if (input_key_down("a")) {
                intendedX = playerPos[0] - PLAYER2_SPEED;
            }
            if (input_key_down("d")) {
                intendedX = playerPos[0] + PLAYER2_SPEED;
            }
            // Obstacle bounds
            const obsLeft = obstaclePos[0] - 30/2;
            const obsRight = obstaclePos[0] + 30/2;
            if (
                intendedX + PLAYER_WIDTH/2 > obsLeft &&
                intendedX - PLAYER_WIDTH/2 < obsRight &&
                playerPos[1] + PLAYER_HEIGHT/2 > obstaclePos[1] - 290/2 &&
                playerPos[1] - PLAYER_HEIGHT/2 < obstaclePos[1] + 290/2
            ) {
                if (playerPos[0] < obstaclePos[0]) {
                    intendedX = obsLeft - PLAYER_WIDTH/2;
                } else {
                    intendedX = obsRight + PLAYER_WIDTH/2;
                }
            }
            playerPos[0] = intendedX;
            // Jump
            if (input_key_down("w") && canJump2) {
                velocityY2 = isUpsideDown2 ? -JUMP2_FORCE : JUMP2_FORCE;
                canJump2 = false;
                jumpSound();
            }
            // Vertical movement
            playerPos[1] = playerPos[1] + velocityY2;
            // Screen horizontal bounds
            playerPos[0] = math_max(PLAYER_WIDTH/2, math_min(1000 - PLAYER_WIDTH/2, playerPos[0]));
            // Vertical wrap
            if (playerPos[1] > 600 + PLAYER_HEIGHT/2) {
                playerPos[1] = -PLAYER_HEIGHT/2;
            } else if (playerPos[1] < -PLAYER_HEIGHT/2) {
                playerPos[1] = 600 + PLAYER_HEIGHT/2;
            }
            // Block collision for only the topmost block2_1 to block2_5 (like solids in level 1/3)
            const blocks = [block2_1, block2_2, block2_3, block2_4, block2_5];
            let topBlockIndex = -1;
            let topBlockY = 10000;
            let blockCountOnScreen = 0;
            for (let i = 0; i < 5; i = i + 1) {
                const blockPos = query_position(blocks[i]);
                if (!(blockPos[0] <= -400 || blockPos[1] <= -400)) {
                    blockCountOnScreen = blockCountOnScreen + 1;
                    if (blockPos[1] < topBlockY) {
                        topBlockY = blockPos[1];
                        topBlockIndex = i;
                    }
                }
            }
            if (blockCountOnScreen > 1 && topBlockIndex !== -1) {
                const block = blocks[topBlockIndex];
                const blockPos = query_position(block);
                const blockScale = query_scale(block);
                // Top collision
                if (
                    playerPos[0] + PLAYER_WIDTH/2 > blockPos[0] - 60 * blockScale[0] &&
                    playerPos[0] - PLAYER_WIDTH/2 < blockPos[0] + 60 * blockScale[0] &&
                    playerPos[1] + PLAYER_HEIGHT/2 >= blockPos[1] - 15 * blockScale[1] &&
                    playerPos[1] + PLAYER_HEIGHT/2 <= blockPos[1] - 15 * blockScale[1] + 10 &&
                    velocityY2 > 0
                ) {
                    playerPos[1] = blockPos[1] - 15 * blockScale[1] - PLAYER_HEIGHT/2;
                    velocityY2 = 0;
                    canJump2 = true;
                    isUpsideDown2 = false;
                    for (let i = 0; i < array_length(player_frames); i = i + 1) {
                        update_scale(player_frames[i], [1, 1]);
                    }
                }
                // Bottom collision (upside down)
                else if (
                    playerPos[0] + PLAYER_WIDTH/2 > blockPos[0] - 60 * blockScale[0] &&
                    playerPos[0] - PLAYER_WIDTH/2 < blockPos[0] + 60 * blockScale[0] &&
                    playerPos[1] - PLAYER_HEIGHT/2 <= blockPos[1] + 15 * blockScale[1] &&
                    playerPos[1] - PLAYER_HEIGHT/2 >= blockPos[1] + 15 * blockScale[1] - 10 &&
                    velocityY2 < 0
                ) {
                    playerPos[1] = blockPos[1] + 15 * blockScale[1] + PLAYER_HEIGHT/2;
                    velocityY2 = 0;
                    canJump2 = true;
                    isUpsideDown2 = true;
                    for (let i = 0; i < array_length(player_frames); i = i + 1) {
                        update_scale(player_frames[i], [1, -1]);
                    }
                }
                // Left collision
                if (
                    playerPos[1] + PLAYER_HEIGHT/2 > blockPos[1] - 15 * blockScale[1] &&
                    playerPos[1] - PLAYER_HEIGHT/2 < blockPos[1] + 15 * blockScale[1] &&
                    playerPos[0] + PLAYER_WIDTH/2 >= blockPos[0] - 60 * blockScale[0] &&
                    playerPos[0] + PLAYER_WIDTH/2 <= blockPos[0] - 60 * blockScale[0] + 10
                ) {
                    playerPos[0] = blockPos[0] - 60 * blockScale[0] - PLAYER_WIDTH/2;
                }
                // Right collision
                else if (
                    playerPos[1] + PLAYER_HEIGHT/2 > blockPos[1] - 15 * blockScale[1] &&
                    playerPos[1] - PLAYER_HEIGHT/2 < blockPos[1] + 15 * blockScale[1] &&
                    playerPos[0] - PLAYER_WIDTH/2 <= blockPos[0] + 60 * blockScale[0] &&
                    playerPos[0] - PLAYER_WIDTH/2 >= blockPos[0] + 60 * blockScale[0] - 10
                ) {
                    playerPos[0] = blockPos[0] + 60 * blockScale[0] + PLAYER_WIDTH/2;
                }
            }
            // Platform collision
            const isHorizontallyOverlapping = 
                playerPos[0] + PLAYER_WIDTH/2 > platformPos[0] - PLATFORM2_WIDTH/2 &&
                playerPos[0] - PLAYER_WIDTH/2 < platformPos[0] + PLATFORM2_WIDTH/2;
            // Platform top collision
            if (isHorizontallyOverlapping && 
                playerPos[1] + PLAYER_HEIGHT/2 >= platformPos[1] - PLATFORM2_HEIGHT/2 &&
                playerPos[1] + PLAYER_HEIGHT/2 <= platformPos[1] - PLATFORM2_HEIGHT/2 + 10 &&
                velocityY2 > 0) {
                playerPos[1] = platformPos[1] - PLATFORM2_HEIGHT/2 - PLAYER_HEIGHT/2;
                velocityY2 = 0;
                canJump2 = true;
                isUpsideDown2 = false;
                for (let i = 0; i < array_length(player_frames); i = i + 1) {
                    update_scale(player_frames[i], [1, 1]);
                }
            }
            // Platform bottom collision (upside down)
            else if (isHorizontallyOverlapping && 
                     playerPos[1] - PLAYER_HEIGHT/2 <= platformPos[1] + PLATFORM2_HEIGHT/2 &&
                     playerPos[1] - PLAYER_HEIGHT/2 >= platformPos[1] + PLATFORM2_HEIGHT/2 - 10 &&
                     velocityY2 < 0) {
                playerPos[1] = platformPos[1] + PLATFORM2_HEIGHT/2 + PLAYER_HEIGHT/2;
                velocityY2 = 0;
                canJump2 = true;
                isUpsideDown2 = true;
                for (let i = 0; i < array_length(player_frames); i = i + 1) {
                    update_scale(player_frames[i], [1, -1]);
                }
            }
            // State change - pass up through platform
            else if (isUpsideDown2 && isHorizontallyOverlapping &&
                     playerPos[1] + PLAYER_HEIGHT/2 < platformPos[1] - PLATFORM2_HEIGHT/2 &&
                     playerPos[1] + PLAYER_HEIGHT/2 + velocityY2 >= platformPos[1] - PLATFORM2_HEIGHT/2) {
                playerPos[1] = platformPos[1] - PLATFORM2_HEIGHT/2 - PLAYER_HEIGHT/2;
                velocityY2 = 0;
                canJump2 = true;
                isUpsideDown2 = false;
                for (let i = 0; i < array_length(player_frames); i = i + 1) {
                    update_scale(player_frames[i], [1, 1]);
                }
            }
            // State change - pass down through platform
            else if (!isUpsideDown2 && isHorizontallyOverlapping &&
                     playerPos[1] - PLAYER_HEIGHT/2 > platformPos[1] + PLATFORM2_HEIGHT/2 &&
                     playerPos[1] - PLAYER_HEIGHT/2 + velocityY2 <= platformPos[1] + PLATFORM2_HEIGHT/2) {
                playerPos[1] = platformPos[1] + PLATFORM2_HEIGHT/2 + PLAYER_HEIGHT/2;
                velocityY2 = 0;
                canJump2 = true;
                isUpsideDown2 = true;
                for (let i = 0; i < array_length(player_frames); i = i + 1) {
                    update_scale(player_frames[i], [1, -1]);
                }
            }
            
            // Place blocks over traps if overlapping (Level 2)
            const blocks2 = [block2_1, block2_2, block2_3, block2_4, block2_5, platform2, obstacle2];
            const traps2 = [trap2_1, trap2_2, traps2_1, traps2_21, traps2_22, button2_1, button2_2, button2_3, button2_4, button2_5];
            for (let i = 0; i < 7; i = i + 1) {
                for (let j = 0; j < 10; j = j + 1) {
                    if (gameobjects_overlap(blocks2[i], traps2[j])) {
                        update_to_top(blocks2[i]);
                    }
                }
            }
            // --- Restore moving trap and button logic for Level 2 ---
            // Button logic
            if (!button2_1Activated) {
                const button1Pos = query_position(button2_1);
                const isPlayerOnButton1 = (
                    playerPos[0] > button1Pos[0] - 15 &&  
                    playerPos[0] < button1Pos[0] + 15 && 
                    playerPos[1] > button1Pos[1] - 20 &&  
                    playerPos[1] < button1Pos[1] + 20     
                );
                if (isPlayerOnButton1) {
                    button2_1Activated = true;  
                    update_position(button2_1, [160, 300]);  
                    update_position(button2_2, [350, 280]);
                    update_position(block2_1, [1500, 100]); 
                    buttonClickSound();
                }
            }
            if (!button2_2Activated) {
                const button2Pos = query_position(button2_2);
                const isPlayerOnButton2 = (
                    playerPos[0] > button2Pos[0] - 15 &&  
                    playerPos[0] < button2Pos[0] + 15 && 
                    playerPos[1] > button2Pos[1] - 20 &&  
                    playerPos[1] < button2Pos[1] + 20     
                );
                if (isPlayerOnButton2) {
                    button2_2Activated = true;  
                    update_position(button2_3, [800, 320]);  
                    update_position(button2_2, [350, 300]);
                    update_position(block2_2, [1500, 100]); 
                    buttonClickSound();
                }
            }
            if (!button2_3Activated) {
                const button3Pos = query_position(button2_3);
                const isPlayerOnButton3 = (
                    playerPos[0] > button3Pos[0] - 15 &&  
                    playerPos[0] < button3Pos[0] + 15 && 
                    playerPos[1] > button3Pos[1] - 20 &&  
                    playerPos[1] < button3Pos[1] + 20     
                );
                if (isPlayerOnButton3) {
                    button2_3Activated = true;  
                    update_position(button2_3, [800, 300]); 
                    update_position(button2_4, [350,280]);
                    update_position(traps2_1,[387,280]);
                    update_position(block2_3, [1500, 100]); 
                    buttonClickSound();
                }
            }
            if (!button2_4Activated) {
                const button4Pos = query_position(button2_4);
                const isPlayerOnButton4 = (
                    playerPos[0] > button4Pos[0] - 15 &&  
                    playerPos[0] < button4Pos[0] + 15 && 
                    playerPos[1] > button4Pos[1] - 20 &&  
                    playerPos[1] < button4Pos[1] + 20     
                );
                if (isPlayerOnButton4) {
                    button2_4Activated = true;  
                    update_position(button2_5, [600, 320]); 
                    update_position(button2_4, [350,300]);
                    update_position(block2_4, [1500, 100]); 
                    update_position(traps2_21, [633,320]);
                    update_position(traps2_22, [567,320]); 
                    buttonClickSound();
                }
            }
            if (!button2_5Activated) {
                const button5Pos = query_position(button2_5);
                const isPlayerOnButton5 = (
                    playerPos[0] > button5Pos[0] - 15 &&  
                    playerPos[0] < button5Pos[0] + 15 && 
                    playerPos[1] > button5Pos[1] - 20 &&  
                    playerPos[1] < button5Pos[1] + 20     
                );
                if (isPlayerOnButton5) {
                    button2_5Activated = true;  
                    update_position(button2_5, [600,300]);
                    update_position(block2_5, [1500, 100]); 
                    buttonClickSound();
                }
            }
            // Trap 1 movement
            if(trap2_1Touch%2===0)
            {
                trap1Pos[0]=trap1Pos[0]+TRAP2_SPEED;
                if(trap1Pos[0]>=855)
                {
                    trap2_1Touch=trap2_1Touch+1;
                }
            }
            else
            {
                trap1Pos[0]=trap1Pos[0]-TRAP2_SPEED;
                if(trap1Pos[0]<=20)
                {
                    trap2_1Touch=trap2_1Touch+1;
                }
            }
            update_position(trap2_1,trap1Pos);
            // Trap 2 movement
            if(trap2_2Touch%2===0)
            {
                trap2Pos[0]=trap2Pos[0]+TRAP2_SPEED;
                if(trap2Pos[0]>=979)
                {
                    trap2_2Touch=trap2_2Touch+1;
                }
            }
            else
            {
                trap2Pos[0]=trap2Pos[0]-TRAP2_SPEED;
                if(trap2Pos[0]<=20)
                {
                    trap2_2Touch=trap2_2Touch+1;
                }
            }
            update_position(trap2_2, trap2Pos);
            // Animate and update all frames
        for (let i = 0; i < array_length(player_frames); i = i + 1) {
            update_position(player_frames[i], playerPos);
        }
        current_player = player_frames[player_frame_index];
        update_sprite(player_frames, player_frame_index, playerPos);
                    // Win condition
            if (gameobjects_overlap(current_player, door2)) {
                gameWon2 = true;
                update_text(collision_happened, "n-Next Level, r-Restart Level, b-Back");
                update_position(collision_happened, [500, 300]);
                // Make text appear on top of platforms
                const blocks2 = [block2_1, block2_2, block2_3, block2_4, block2_5, platform2, obstacle2];
                for (let i = 0; i < 7; i = i + 1) {
                    if (gameobjects_overlap(collision_happened, blocks2[i])) {
                        update_to_top(collision_happened);
                    }
                }
                currentState = 2.5;
                victorySound();
            }
            // Death condition
            if (gameobjects_overlap(current_player, trap2_1) || 
                gameobjects_overlap(current_player, trap2_2) ||
                gameobjects_overlap(current_player, traps2_1) ||
                gameobjects_overlap(current_player, traps2_21) ||
                gameobjects_overlap(current_player, traps2_22)) {
                gameOver2 = true;
                update_text(collision_happened, "Game Over!");
                update_position(collision_happened, [500, 300]);
                // Make text appear on top of platforms
                const blocks2 = [block2_1, block2_2, block2_3, block2_4, block2_5, platform2, obstacle2];
                for (let i = 0; i < 7; i = i + 1) {
                    if (gameobjects_overlap(collision_happened, blocks2[i])) {
                        update_to_top(collision_happened);
                    }
                }
            // Trigger death animation for level 2
            const playerPos = query_position(current_player);
            for(let k=1;k<=12;k=k+1){
                death_piecesVX[k]=(math_random() -0.5)*30;
                death_piecesVY[k]= (math_random()-1.5)*30;
            }
            update_position(death_pieces[1],[playerPos[0]-3.5,playerPos[1]-15]);
            update_position(death_pieces[2],[playerPos[0]+2.5,playerPos[1]-9]);
            update_position(death_pieces[3],[playerPos[0]-4,playerPos[1]-13]);
            update_position(death_pieces[4],[playerPos[0],playerPos[1]-5]);
            update_position(death_pieces[5],[playerPos[0]+4,playerPos[1]-6]);
            update_position(death_pieces[6],[playerPos[0]-3.5,playerPos[1]+3]);
            update_position(death_pieces[7],[playerPos[0],playerPos[1]+4]);
            update_position(death_pieces[8],[playerPos[0]+5,playerPos[1]+3]);
            update_position(death_pieces[9],[playerPos[0]+2,playerPos[1]+2]);
            update_position(death_pieces[10],[playerPos[0]-2,playerPos[1]+4]);
            update_position(death_pieces[11],[playerPos[0]+3.5,playerPos[1]+10]);
            update_position(death_pieces[12],[playerPos[0]+3.5,playerPos[1]+14.5]);
            hide_all_frames(player_frames);
            death_animation_active = true;
            deathSound();
        }
        if(playerPos[1]>300){
            for(let i=0;i<array_length(player_frames);i=i+1){
                update_scale(player_frames[i],[0.7,-0.5]);
            }
        }
        debug_log(stringify(playerPos[1]));
        }
        // Animate death pieces and handle restart/back if dead (level 2)
        if (gameOver2) {
            if (death_animation_active) {
                let pisPos=[];
                for(let j=1;j<=12;j=j+1){
                    pisPos[j]=query_position(death_pieces[j]);
                    if(death_pis_on_obj[j]===0){
                        death_piecesVY[j]=death_piecesVY[j]+GRAVITY2*2;
                        pisPos[j][1]=pisPos[j][1]+death_piecesVY[j];
                    }
                    pisPos[j][0]=pisPos[j][0]+death_piecesVX[j];
                    death_pis_on_obj[j] = 0;
                    // Collide with blocks, platform, and obstacle
                    const solids = [block2_1, block2_2, block2_3, block2_4, block2_5, platform2, obstacle2];
                    for(let s=0;s<array_length(solids);s=s+1){
                        const objPos = query_position(solids[s]);
                        const objW = query_scale(solids[s])[0]*120; // block width
                        const objH = query_scale(solids[s])[1]*30;  // block height
                        if (death_piecesVY[j] < 0 &&
                            (pisPos[j][1] - death_pieces_H[j]/2 <= objPos[1] + objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 >= objPos[1] + objH/2 - 50) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                            pisPos[j][1] = objPos[1] + objH/2 + death_pieces_H[j]/2;
                            death_piecesVY[j] = 0;
                        }
                        // Top collision (piece lands on top of a solid)
                        if (death_piecesVY[j] >= 0 &&
                            (pisPos[j][1] + death_pieces_H[j]/2 >= objPos[1] - objH/2) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 <= objPos[1] - objH/2 + 50) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                            pisPos[j][1] = objPos[1] - objH/2 - death_pieces_H[j]/2;
                            death_piecesVY[j] = 0;
                            death_pis_on_obj[j] = 1;
                        }
                        // Left collision
                        if (
                            (pisPos[j][0] + death_pieces_W[j]/2 >= objPos[0] - objW/2) &&
                            (pisPos[j][0] + death_pieces_W[j]/2 <= objPos[0] - objW/2 + 50) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                        ) {
                            pisPos[j][0] = objPos[0] - objW/2 - death_pieces_W[j]/2;
                            death_piecesVX[j]= -death_piecesVX[j]*0.5;
                        }
                        // Right collision
                        else if (
                            (pisPos[j][0] - death_pieces_W[j]/2 <= objPos[0] + objW/2) &&
                            (pisPos[j][0] - death_pieces_W[j]/2 >= objPos[0] + objW/2 - 50) &&
                            (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                            (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                        ) {
                            pisPos[j][0] = objPos[0] + objW/2 + death_pieces_W[j]/2;
                            death_piecesVX[j]= -death_piecesVX[j]*0.5;
                        }
                    }
                    update_position(death_pieces[j],pisPos[j]);
                }
            }
            // On restart, hide all death pieces and reset flag
            if(input_key_down("r")){
                clear_death_pieces();
                clearlevel2();
                level2setup();
                gameOver2 = false;
            }
            if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
                curtainSequence = 0;
                pendingTransition = "main_from_2";
            }
            if(curtainSequence === 3 && pendingTransition === "main_from_2"){
                currentState="select";
                pendingTransition = null;
            }
            if(curtainSequence === 2 && pendingTransition === "main_from_2"){
                clearlevel2();
                clear_death_pieces();
                initSelect();
            }
        }
    }
    
    // Level 1.5: Wait for user input after finishing level 1
    if(currentState===1.5){
        // Show 'Next level' message (already set)
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_tutorial";
        }
        if(input_key_down("n") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "next1";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_tutorial"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 3 && pendingTransition === "next1"){
            currentState=2;
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_tutorial"){
            clearlevel1();
            clear_death_pieces();
            initSelect();
        }
        if(curtainSequence === 2 && pendingTransition === "next1"){
            cleartutorial();
            clearlevel1();
            clear_death_pieces();
            level2setup();
        }
        if(input_key_down("r")){
            clearlevel1();
            clear_death_pieces();
            level1setup();
            tutorial_isAlive=true;
            tutorial_hasWon=false;
        }
    }

    if(currentState===1){
        // Always allow restart and back to select
        if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
            curtainSequence = 0;
            pendingTransition = "main_from_tutorial";
        }
        if(curtainSequence === 3 && pendingTransition === "main_from_tutorial"){
            currentState="select";
            pendingTransition = null;
        }
        if(curtainSequence === 2 && pendingTransition === "main_from_tutorial"){
            clearlevel1();
            initSelect();
        }
        if(!pendingTransition){
            if(input_key_down("r")){
                clearlevel1();
                level1setup();
                tutorial_isAlive=true;
                tutorial_hasWon=false;
            }
            if(!alive){
                if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
                    curtainSequence = 0;
                    pendingTransition = "main_from_tutorial";
                    curtainsequence();
                }
                if(curtainSequence === 3 && pendingTransition === "main_from_tutorial"){
                    currentState="select";
                    pendingTransition = null;
                }
                if(curtainSequence === 2 && pendingTransition === "main_from_tutorial"){
                    clearlevel1();
                    initSelect();
                }
                if(input_key_down("r")){
                    clearlevel1();
                    level1setup();
                    tutorial_isAlive=true;
                    tutorial_hasWon=false;
                }
            }
            if(alive){
                let playerPos = query_position(current_player);
                const left = input_key_down("a");
                const right = input_key_down("d");
                let moving = left || right;
                if (left && !facing_left) {
                    facing_left = true;
                    set_sprite_direction(player_frames, true);
                } else if (right && facing_left) {
                    facing_left = false;
                    set_sprite_direction(player_frames, false);
                }
                if (left) { playerPos[0] = playerPos[0] - PLAYER_MOVE_SPEED; }
                if (right) { playerPos[0] = playerPos[0] + PLAYER_MOVE_SPEED; }
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
                // Jumping
                if(!on_object){
                    velocityY = velocityY + GRAVITY;
                    playerPos[1] = playerPos[1] + velocityY;
                }
                if (input_key_down("w") && on_object) {
                    tryjump = true;
                    velocityY = JUMP_FORCE;
                    on_object = false;
                    jumpSound();
                }
                const currentPlayerScale = query_scale(current_player);
                const currentPlayerHeight = PLAYER_HEIGHT * currentPlayerScale[1];
                const currentPlayerWidth = PLAYER_WIDTH * currentPlayerScale[0];
                // --- BEGIN trapSequence logic (restored) ---
                //First Spike
                // Stretched for new width: 100 * 1.67 ≈ 167
                if (playerPos[0] >= 167 && input_key_down("d") && trapSequence === 0)
                {
                    update_position(game_traps[0], [0, 305]);
                    trapSequence = trapSequence + 1;
                    gameTime = get_game_time();
                }
                let spikesPos = query_position(game_traps[0]);
                // Stretched: 300 * 1.67 ≈ 500
                if (spikesPos[0]>=500 && spikesPos[1]>=340 && trapSequence === 1){
                    trapSequence=2;
                }
                else if(spikesPos[0]>=500 && trapSequence === 1){
                    update_position(game_traps[0], [spikesPos[0], spikesPos[1]+SPIKES_MOVE_SPEED*2]);
                }
                else if (trapSequence === 1)
                {
                    update_position(game_traps[0], [spikesPos[0] + SPIKES_MOVE_SPEED, spikesPos[1]]);
                }
                //Second Spike
                // Stretched: 350 * 1.67 ≈ 583, 420 * 1.67 ≈ 700
                if (playerPos[0] >= 583 && input_key_down("d") && trapSequence === 2)
                {
                    update_position(game_traps[1], [700, 335]);
                    trapSequence = trapSequence + 1;
                    gameTime = get_game_time();
                }
                spikesPos = query_position(game_traps[1]);
                // Stretched: 115 * 1.67 ≈ 192
                if (spikesPos[0]<=210 && spikesPos[1]>=340 && trapSequence === 4){
                    trapSequence=5;
                }
                else if(spikesPos[0]<=210 && trapSequence === 4 && get_game_time() - gameTime>=500){
                    update_position(game_traps[1], [spikesPos[0], spikesPos[1]+SPIKES_MOVE_SPEED]);
                    update_position(game_traps[0], [query_position(game_traps[0])[0]-SPIKES_MOVE_SPEED*2, 305]);
                }
                else if(spikesPos[0]<=210 && trapSequence === 3){
                    //nothing
                }
                else if (get_game_time() - gameTime >= 1000 && trapSequence === 3)
                {
                    update_position(game_traps[1], [spikesPos[0] - SPIKES_MOVE_SPEED*1.25, spikesPos[1]]);
                }
                else if (get_game_time() - gameTime >100 && trapSequence === 3){
                    //nothing
                }
                else if (get_game_time() - gameTime >0 && trapSequence === 3){
                    update_position(game_traps[1], [spikesPos[0], spikesPos[1]-SPIKES_MOVE_SPEED]);
                }
                // Stretched: 150 * 1.67 ≈ 250, 300 * 1.67 ≈ 500, 20 * 1.67 ≈ 33
                if(spikesPos[0]<=250 && trapSequence === 3 && query_position(game_traps[0])[0]>=500){
                    update_position(game_traps[0], [0, 305]);
                }
                else if(spikesPos[0]<=250 && trapSequence === 3 && query_position(game_traps[0])[0]<33){
                    update_position(game_traps[0], [query_position(game_traps[0])[0]+SPIKES_MOVE_SPEED, 305]);
                }
                else if(spikesPos[0]<=250 && trapSequence === 3 && query_position(game_traps[0])[0]>=33){
                    gameTime=get_game_time();
                    trapSequence=4;
                }
                //Above Spikes
                // Stretched: 300 * 1.67 ≈ 500
                if(playerPos[0]>=500 && trapSequence===5){
                    for(let i=2;i<22;i=i+1){
                        // Spread 20 traps across the longer hallway
                        update_position(game_traps[i],[75+45*(i-2),264]);
                    }
                    gameTime=get_game_time();
                    trapSequence=6;
                }
                if(trapSequence===6){
                    for(let i=2;i<22;i=i+1){
                        if(get_game_time()-gameTime>=130*(i-2) && get_game_time()-gameTime<=130*(i-1)){
                            update_position(game_traps[i],[query_position(game_traps[i])[0],query_position(game_traps[i])[1]+SPIKES_MOVE_SPEED]);
                        }
                    }
                }
                if(trapSequence===6 && get_game_time()-gameTime>=2000){ // increased from 1300 for longer hallway
                    trapSequence=7;
                }
                //Transport Door
                if(trapSequence===7){
                    gameTime=get_game_time();
                    trapSequence=8;
                }
                // Stretched: 100 * 1.67 ≈ 167
                if(trapSequence === 8 && get_game_time()-gameTime>150){ // slightly increased for pacing
                    trapSequence=9;
                    if(playerPos[0]<167){
                        update_position(transportDoor,[-500,-500]);
                    }
                }
                else if(trapSequence===8){
                    for(let i=2;i<22;i=i+1){ // Spread 20 traps across the longer hallway
                        update_position(game_traps[i],[query_position(game_traps[i])[0],query_position(game_traps[i])[1]-SPIKES_MOVE_SPEED*1.5]);
                    }
                    if(query_position(game_traps[10])[1]!==265){
                        update_position(transportDoor,[820,300]); // moved further right
                    }
                }
                //Changing Door positiion
                // Stretched: 650 * 1.67 ≈ 1085, 500 * 1.67 ≈ 833, 555 * 1.67 ≈ 925, 100 * 1.67 ≈ 167
                // Only allow the door to move if player has run back past the transport door spawn (x > 820)
                if(trapSequence===10 && query_position(door)[0]>=1085){
                    update_position(door,[-50,305]);
                    trapSequence=11;
                }
                else if(trapSequence===10){
                    update_position(door,[query_position(door)[0]+SPIKES_MOVE_SPEED,305]);
                }
                if(trapSequence===9 && playerPos[0]>840){
                    trapSequence=10;
                }
                if(trapSequence===11 && query_position(door)[0]<=167){
                    update_position(door,[query_position(door)[0]+SPIKES_MOVE_SPEED,305]);
                }
                if(trapSequence===11 && query_position(door)[0]>167){
                    trapSequence=12;
                    for(let i=1;i<8;i=i+1){
                        update_position(game_traps[i],[-500,-500]);
                    }
                }
                //Changing Door, Floor, and Ceiling Position
                // Stretched: 50 * 1.67 ≈ 83, 165 * 1.67 ≈ 275, 75 * 1.67 ≈ 125, 175 * 1.67 ≈ 292
                if(trapSequence===12 && query_position(door)[0]>83 && playerPos[0]<275 && input_key_down("a")){
                    trapSequence=13;
                }
                if(trapSequence===13 && query_position(door)[0]>83){
                    update_position(door,[query_position(door)[0]-SPIKES_MOVE_SPEED,305]);
                    update_position(game_solids[11],[query_position(game_solids[11])[0]-SPIKES_MOVE_SPEED/1.35,query_position(game_solids[11])[1]]);
                    update_position(game_solids[0],[query_position(game_solids[0])[0],query_position(game_solids[0])[1]-SPIKES_MOVE_SPEED]);
                    update_position(game_solids[1],[query_position(game_solids[1])[0],query_position(game_solids[1])[1]-SPIKES_MOVE_SPEED]);
                    update_position(game_solids[2],[query_position(game_solids[2])[0],query_position(game_solids[2])[1]-SPIKES_MOVE_SPEED]);
                }
                // --- END trapSequence logic (restored) ---
                // Collision with solids
                on_object = false;
                let on_object_check = 0;
                for (let i = 0; i < objos_list_size; i = i + 1) {
                    const ob = game_solids[objos_list[i]];
                    const ob_pos = query_position(ob);
                    if (!tryjump && (playerPos[1] + PLAYER_HEIGHT/2 >= ob_pos[1]-50) && (playerPos[1] + PLAYER_HEIGHT/2 - ob_pos[1] + 50<= 25) && (playerPos[0] + PLAYER_WIDTH/2 > ob_pos[0]-50) && (playerPos[0] - PLAYER_WIDTH/2 < ob_pos[0]+50)) {
                        playerPos[1] = ob_pos[1] - 50 - PLAYER_HEIGHT/2;
                        velocityY = 0;
                        on_object = true;
                        on_object_check=1;
                    }
                    else if((playerPos[1] - PLAYER_HEIGHT/2 <= ob_pos[1]+50) && (playerPos[1] - PLAYER_HEIGHT/2 - ob_pos[1] - 50>= -25) && (playerPos[0] + PLAYER_WIDTH/2 > ob_pos[0]-50) && (playerPos[0] - PLAYER_WIDTH/2 < ob_pos[0]+50)){
                        playerPos[1] = ob_pos[1] + 50 + PLAYER_HEIGHT/2;
                        velocityY = 0;
                        on_object=false;
                    }
                    if((playerPos[0] + PLAYER_WIDTH/2 >= ob_pos[0]-50) && (playerPos[0] + PLAYER_WIDTH/2 - ob_pos[0] + 50 <= 25) && (playerPos[1] + PLAYER_HEIGHT/2 > ob_pos[1] - 50) && (playerPos[1] - PLAYER_HEIGHT/2 < ob_pos[1] +50)){
                        playerPos[0] = ob_pos[0] - 50 - PLAYER_WIDTH/2;
                    }
                    else if((playerPos[0] - PLAYER_WIDTH/2 <= ob_pos[0]+50) && (playerPos[0] - PLAYER_WIDTH/2 - ob_pos[0] - 50>= -25) && (playerPos[1] + PLAYER_HEIGHT/2 > ob_pos[1] - 50) && (playerPos[1] - PLAYER_HEIGHT/2 < ob_pos[1] +50)){
                        playerPos[0] = ob_pos[0] + 50 + PLAYER_WIDTH/2;
                    }
                }
                if(on_object_check!==1){
                    on_object_check=0;
                    on_object=false;
                }
                // Transport door teleport logic (Level 1)
                if (gameobjects_overlap(current_player, transportDoor)) {
                    playerPos[0] = 70;
                    playerPos[1] = 300;
                }
                if (gameobjects_overlap(current_player, door)) {
                    update_position(collision_happened, [500, 300]);
                    update_text(collision_happened, "n-Next Level, r-Restart Level, b-Back");
                    victorySound();
                    currentState=1.5;
                    pendingTransition=null;
                }
                for(let i=0;i<array_length(game_traps);i=i+1){
                    for(let j=0;j<array_length(game_solids);j=j+1){
                        if(gameobjects_overlap(game_traps[i],game_solids[j])){
                            update_to_top(game_solids[j]);
                        }
                    }
                }
                update_sprite(player_frames, player_frame_index, playerPos);
                if (tryjump) {
                    tryjump=false;
                }
                // Death by trap
                for(let i=0;i<20;i=i+1){
                    if (gameobjects_overlap(current_player, game_traps[i])) {
                        update_position(collision_happened, [500, 300]);
                        update_text(collision_happened, "Game Over!");
                        alive = false;
                        // Trigger death animation for level 1
                        const playerPos = query_position(current_player);
                        for(let k=1;k<=12;k=k+1){
                            death_piecesVX[k]=(math_random() -0.5)*30;
                            death_piecesVY[k]= (math_random()-1.5)*30;
                        }
                        update_position(death_pieces[1],[playerPos[0]-3.5,playerPos[1]-15]);
                        update_position(death_pieces[2],[playerPos[0]+2.5,playerPos[1]-9]);
                        update_position(death_pieces[3],[playerPos[0]-4,playerPos[1]-13]);
                        update_position(death_pieces[4],[playerPos[0],playerPos[1]-5]);
                        update_position(death_pieces[5],[playerPos[0]+4,playerPos[1]-6]);
                        update_position(death_pieces[6],[playerPos[0]-3.5,playerPos[1]+3]);
                        update_position(death_pieces[7],[playerPos[0],playerPos[1]+4]);
                        update_position(death_pieces[8],[playerPos[0]+5,playerPos[1]+3]);
                        update_position(death_pieces[9],[playerPos[0]+2,playerPos[1]+2]);
                        update_position(death_pieces[10],[playerPos[0]-2,playerPos[1]+4]);
                        update_position(death_pieces[11],[playerPos[0]+3.5,playerPos[1]+10]);
                        update_position(death_pieces[12],[playerPos[0]+3.5,playerPos[1]+14.5]);
                        hide_all_frames(player_frames);
                        death_animation_active = true;
                        deathSound();
                    }
                }

            }
            // Animate death pieces and handle restart/back if dead (level 1)
            if (!alive) {
                if (death_animation_active) {
                    let pisPos=[];
                    for(let j=1;j<=12;j=j+1){
                        pisPos[j]=query_position(death_pieces[j]);
                        if(death_pis_on_obj[j]===0){
                            death_piecesVY[j]=death_piecesVY[j]+GRAVITY*2;
                            pisPos[j][1]=pisPos[j][1]+death_piecesVY[j];
                        }
                        pisPos[j][0]=pisPos[j][0]+death_piecesVX[j];
                        death_pis_on_obj[j] = 0;
                        // Collide with any game_solid
                        for(let s=0;s<array_length(game_solids);s=s+1){
                            const objPos = query_position(game_solids[s]);
                            const objW = 100*query_scale(game_solids[s])[0];
                            const objH = 100*query_scale(game_solids[s])[1];
                            // Top collision
                            if (death_piecesVY[j] < 0 &&
                                (pisPos[j][1] - death_pieces_H[j]/2 <= objPos[1] + objH/2) &&
                                (pisPos[j][1] - death_pieces_H[j]/2 >= objPos[1] + objH/2 - 50) &&
                                (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                                (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                                pisPos[j][1] = objPos[1] + objH/2 + death_pieces_H[j]/2;
                                death_piecesVY[j] = 0;
                            }
                            // Top collision (piece lands on top of a solid)
                            if (death_piecesVY[j] >= 0 &&
                                (pisPos[j][1] + death_pieces_H[j]/2 >= objPos[1] - objH/2) &&
                                (pisPos[j][1] + death_pieces_H[j]/2 <= objPos[1] - objH/2 + 50) &&
                                (pisPos[j][0] + death_pieces_W[j]/2 > objPos[0] - objW/2) &&
                                (pisPos[j][0] - death_pieces_W[j]/2 < objPos[0] + objW/2)) {
                                pisPos[j][1] = objPos[1] - objH/2 - death_pieces_H[j]/2;
                                death_piecesVY[j] = 0;
                                death_pis_on_obj[j] = 1;
                            }
                            // Left collision
                            if (
                                (pisPos[j][0] + death_pieces_W[j]/2 >= objPos[0] - objW/2) &&
                                (pisPos[j][0] + death_pieces_W[j]/2 <= objPos[0] - objW/2 + 50) &&
                                (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                                (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                            ) {
                                pisPos[j][0] = objPos[0] - objW/2 - death_pieces_W[j]/2;
                                death_piecesVX[j]= -death_piecesVX[j]*0.5;
                            }
                            // Right collision
                            else if (
                                (pisPos[j][0] - death_pieces_W[j]/2 <= objPos[0] + objW/2) &&
                                (pisPos[j][0] - death_pieces_W[j]/2 >= objPos[0] + objW/2 - 50) &&
                                (pisPos[j][1] + death_pieces_H[j]/2 > objPos[1] - objH/2) &&
                                (pisPos[j][1] - death_pieces_H[j]/2 < objPos[1] + objH/2)
                            ) {
                                pisPos[j][0] = objPos[0] + objW/2 + death_pieces_W[j]/2;
                                death_piecesVX[j]= -death_piecesVX[j]*0.5;
                            }
                        }
                        update_position(death_pieces[j],pisPos[j]);
                    }
                }
                
                // On restart, hide all death pieces and reset flag
                if(input_key_down("r")){
                    clear_death_pieces();
                    clearlevel1();
                    level1setup();
                    alive=true;
                }
                // On back, hide all death pieces, reset flag, and go to select
                if(input_key_down("b") && curtainSequence === 3 && !pendingTransition){
                    clear_death_pieces();
                    curtainSequence = 0;
                    pendingTransition = "main_from_tutorial";
                    curtainsequence();
                }
                if(curtainSequence === 3 && pendingTransition === "main_from_tutorial"){
                    currentState="select";
                    pendingTransition = null;
                }
                if(curtainSequence === 2 && pendingTransition === "main_from_tutorial"){
                    clearlevel1();
                    initSelect();
                }
            }
        }
    }
    // Repeat for levels 2, 3, 4, 5, using current_player and playerPos for all logic, and animating as above.
    
    if(currentState==="select"){
        if(curtainSequence===2){
            initSelect();
            if(k===0){
                clearselect();
                tutorialsetup();
                currentState=0;
                k=-1;
            }
            if(k===1){
                clearselect();
                level1setup();
                currentState=1;
                k=-1;
            }
            if(k===2){
                clearselect();
                level2setup();
                currentState=2;
                k=-1;
            }
            if(k===3){
                clearselect();
                level3setup();
                currentState=3;
                k=-1;
            }
            if(k===4){
                clearselect();
                level4setup();
                currentState=4;
                k=-1;
            }
            if(k===5){
                clearselect();
                level5setup();
                currentState=5;
                k=-1;
            }
            if(k===6){
                clearselect();
                level6setup();
                currentState=6;
                k=-1;
            }
        }
        else if(curtainSequence===3){
            if(input_key_down("0")){
                curtainSequence=0;
                k=0;
                debug_log("tutorial level generated");
            }
            else if(input_key_down("1")){
                curtainSequence=0;
                k=1;
                debug_log("level 1 generated");
            }
            else if(input_key_down("2")){
                curtainSequence=0;
                k=2;
            }
            else if(input_key_down("3")){
                curtainSequence=0;
                k=3;
            }
            else if(input_key_down("4")){
                curtainSequence=0;
                k=4;
            }
            else if(input_key_down("5")){
                curtainSequence=0;
                k=5;
            }
            else if(input_key_down("6")){
                curtainSequence=0;
                k=6;
            }
        }
    }
    
});
build_game();
