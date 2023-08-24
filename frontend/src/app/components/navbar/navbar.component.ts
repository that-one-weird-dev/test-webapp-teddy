import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "navbar",
    templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
    constructor(private router: Router) {}

    isAddDataVisible(): boolean {
        return this.router.url.split("#")[0].split("?")[0] == "/";
    }
}
