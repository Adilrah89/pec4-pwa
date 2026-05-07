import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreweryService } from '../../services/brewery.service';
import { BreweryCardComponent } from '../../components/brewery-card/brewery-card.component';
import { BreweryGridComponent } from '../../components/brewery-grid/brewery-grid.component';
import { Brewery } from '../../models/brewery.interface';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-brewery-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    BreweryCardComponent,
    BreweryGridComponent,
  ],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(60, [
              animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
  template: `
    <div class="list-container">
      <div class="list-header">
        <div>
          <h1 class="list-title">Cervecerías Artesanales</h1>
          <p class="list-subtitle">Descubre las mejores cervecerías del mundo</p>
        </div>
        <mat-button-toggle-group [(value)]="viewMode" class="view-toggle">
          <mat-button-toggle value="cards">
            <mat-icon>grid_view</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="table">
            <mat-icon>view_list</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      @if (loading()) {
        <div class="spinner-wrapper">
          <mat-spinner diameter="60" color="primary"></mat-spinner>
          <p>Cargando cervecerías…</p>
        </div>
      }

      @if (!loading() && viewMode === 'cards') {
        <div class="cards-grid" [@listAnimation]="breweries().length">
          @for (brewery of breweries(); track brewery.id) {
            <app-brewery-card
              [brewery]="brewery"
              (selected)="goToDetail($event)"
            />
          }
        </div>
      }

      @if (!loading() && viewMode === 'table') {
        <div class="table-section">
          <app-brewery-grid
            [breweries]="breweries()"
            (selected)="goToDetail($event)"
          />
        </div>
      }
    </div>
  `,
  styles: [`
    .list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .list-title {
      font-family: 'Oswald', sans-serif;
      font-size: 2rem;
      color: #7b2d0a;
      margin: 0;
    }
    .list-subtitle {
      color: #888;
      margin: 4px 0 0;
      font-size: 0.95rem;
    }
    .view-toggle {
      border-radius: 8px !important;
      overflow: hidden;
    }
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 0;
      gap: 16px;
      color: #b5451b;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .table-section {
      margin-top: 8px;
    }
  `],
})
export class BreweryListComponent implements OnInit {
  private readonly breweryService = inject(BreweryService);
  private readonly router = inject(Router);

  breweries = signal<Brewery[]>([]);
  loading = signal(true);
  viewMode: 'cards' | 'table' = 'cards';

  ngOnInit(): void {
    this.breweryService.getBreweries(1, 20).subscribe({
      next: (data) => {
        this.breweries.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  goToDetail(id: string): void {
    this.router.navigate(['/breweries', id]);
  }
}
