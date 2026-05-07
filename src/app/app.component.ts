import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span class="toolbar-brand">🍺 BrewMap</span>
      <span class="toolbar-subtitle">Cervecerías Artesanales</span>
    </mat-toolbar>
    <main class="app-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: linear-gradient(135deg, #b5451b 0%, #7b2d0a 100%) !important;
    }
    .toolbar-brand {
      font-family: 'Oswald', sans-serif;
      font-size: 1.4rem;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .toolbar-subtitle {
      margin-left: 12px;
      font-size: 0.85rem;
      opacity: 0.8;
    }
    .app-content {
      min-height: calc(100vh - 64px);
      background: #f5f0eb;
    }
  `],
})
export class AppComponent {}
