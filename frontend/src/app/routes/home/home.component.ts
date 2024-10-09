import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { ToolbarComponent } from '../../core/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import {AlertsComponent} from "../alerts/alerts.component";
import {AlertComponent} from "../../shared/alert/alert.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent,
    ToolbarComponent,
    CommonModule,
    AlertsComponent,
    AlertComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isSidebarOpen = true;
  screenWidth: number = 1024;

  ngOnInit() {
    this.onResize();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  onSidebarClosed() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
    }

    if (this.screenWidth < 1024) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }
}
