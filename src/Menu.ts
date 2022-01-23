import { game_state_i } from "./Game";

export default class Menu {
    menuEl: HTMLDivElement;
    runEl!: HTMLButtonElement;

    constructor(private game_state: game_state_i) {
        this.menuEl = document.getElementById("Menu") as HTMLDivElement;
        this.runEl = document.getElementById("Run") as HTMLButtonElement;
        this.runEl.addEventListener("click", this.run_game.bind(this))
        document.addEventListener("keydown", this.pause_menu.bind(this))
    }

    pause_menu(e: KeyboardEvent) {
        if (e.code === "Escape") {
            if (this.game_state.state === "running") {
                this.game_state.state = "paused";
                this.menuEl.style.display = "block";
                this.runEl.innerText = "Resume";
            } else if (this.game_state.state === "paused") {
                this.game_state.state = "running";
                this.menuEl.style.display = "none";
            }
        }
    }

    run_game() {
        this.menuEl.style.display = "none";
        if (this.game_state.state !== "paused") {
            this.game_state.state = "newgame";
        } else {
            this.game_state.state = "running";
        }
    }

    game_over() {
        this.menuEl.style.display = "block";
        this.runEl.innerText = "Start new game";
    }
}