import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BreweryService } from '../../services/brewery.service';
import { Brewery } from '../../models/brewery.interface';

@Component({
  selector: 'app-brewery-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    <div class="detail-container">

      @if (loading()) {
        <div class="spinner-wrapper">
          <mat-spinner diameter="50" color="primary"></mat-spinner>
        </div>
      }

      @if (!loading() && brewery()) {
        <!-- CABECERA -->
        <div class="detail-header">
          <div class="header-main">
            <h1 class="brewery-name">{{ brewery()!.name }}</h1>
            <span class="type-badge" [class]="'badge-' + brewery()!.brewery_type">
              {{ brewery()!.brewery_type | titlecase }}
            </span>
          </div>
          <button mat-stroked-button color="primary" class="back-btn" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon> Volver
          </button>
        </div>

        <mat-divider></mat-divider>

        <!-- BOTÓN SHOW ALL DETAILS -->
        @if (!showDetails()) {
          <div class="show-details-wrapper">
            <button mat-flat-button color="accent" (click)="showDetails.set(true)">
              <mat-icon>expand_more</mat-icon> Show all details
            </button>
          </div>
        }

        <!-- DETALLES EXPANDIDOS CON ANGULAR MATERIAL -->
        @if (showDetails()) {
          <div class="details-section">

            <!-- TABS: Información general / Ubicación / Contacto -->
            <mat-tab-group animationDuration="300ms" color="accent">

              <mat-tab label="Información general">
                <div class="tab-content">
                  <p class="description">{{ brewery()!.description }}</p>

                  <!-- Progress bar: capacidad de producción -->
                  <h3>Capacidad de producción</h3>
                  <p class="capacity-label">
                    {{ brewery()!.capacity_liters?.toLocaleString() }} litros / año
                  </p>
                  <mat-progress-bar
                    mode="determinate"
                    [value]="capacityPercent()"
                    color="accent"
                  ></mat-progress-bar>
                  <p class="capacity-hint">Respecto al máximo de la categoría (50.000 L)</p>

                  <!-- Año de fundación -->
                  <div class="founded-info">
                    <mat-icon>calendar_today</mat-icon>
                    <span>Fundada en <strong>{{ brewery()!.founded_year }}</strong></span>
                  </div>
                </div>
              </mat-tab>

              <mat-tab label="Ubicación">
                <div class="tab-content">
                  <div class="location-item">
                    <mat-icon color="primary">location_on</mat-icon>
                    <div>
                      <p><strong>Dirección:</strong> {{ brewery()!.address_1 ?? 'No disponible' }}</p>
                      <p><strong>Ciudad:</strong> {{ brewery()!.city }}</p>
                      <p><strong>Provincia/Estado:</strong> {{ brewery()!.state_province }}</p>
                      <p><strong>Código postal:</strong> {{ brewery()!.postal_code }}</p>
                      <p><strong>País:</strong> {{ brewery()!.country }}</p>
                    </div>
                  </div>

                  @if (brewery()!.latitude && brewery()!.longitude) {
                    <div class="coordinates">
                      <mat-icon>gps_fixed</mat-icon>
                      <span>{{ brewery()!.latitude }}, {{ brewery()!.longitude }}</span>
                    </div>
                  }
                </div>
              </mat-tab>

              <mat-tab label="Contacto">
                <div class="tab-content">
                  @if (brewery()!.phone) {
                    <div class="contact-row">
                      <mat-icon color="primary">phone</mat-icon>
                      <span>{{ brewery()!.phone }}</span>
                    </div>
                  }
                  @if (brewery()!.website_url) {
                    <div class="contact-row">
                      <mat-icon color="primary">language</mat-icon>
                      <a [href]="brewery()!.website_url" target="_blank" rel="noopener">
                        {{ brewery()!.website_url }}
                      </a>
                    </div>
                  }
                  @if (!brewery()!.phone && !brewery()!.website_url) {
                    <p class="no-contact">No hay datos de contacto disponibles.</p>
                  }
                </div>
              </mat-tab>

            </mat-tab-group>

            <!-- EXPANSION PANEL: Premios -->
            <mat-accordion class="awards-accordion">
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>emoji_events</mat-icon>&nbsp;Premios y reconocimientos
                  </mat-panel-title>
                  <mat-panel-description>
                    {{ brewery()!.awards?.length }} galardones
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <div class="awards-list">
                  @for (award of brewery()!.awards; track award) {
                    <div class="award-item">
                      <mat-icon class="award-icon">star</mat-icon>
                      <span>{{ award }}</span>
                    </div>
                  }
                </div>
              </mat-expansion-panel>
            </mat-accordion>

          </div>
        }
      }

    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .spinner-wrapper {
      display: flex; justify-content: center; padding: 80px 0;
    }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }
    .header-main {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .brewery-name {
      font-family: 'Oswald', sans-serif;
      font-size: 2rem;
      color: #7b2d0a;
      margin: 0;
    }
    .type-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      width: fit-content;
    }
    .badge-micro { background: #fde8e0; color: #b5451b; }
    .badge-brewpub { background: #fdebd0; color: #e67e22; }
    .badge-large { background: #d6eaf8; color: #2980b9; }
    .badge-regional { background: #d5f5e3; color: #27ae60; }
    .badge-contract { background: #e8d5f5; color: #8e44ad; }
    .back-btn { align-self: flex-start; }
    .show-details-wrapper {
      margin: 28px 0;
      text-align: center;
    }
    .details-section { margin-top: 24px; }
    .tab-content {
      padding: 20px 0;
    }
    .description {
      font-size: 1rem;
      line-height: 1.6;
      color: #444;
      margin-bottom: 20px;
    }
    .capacity-label {
      font-weight: 600;
      color: #b5451b;
      margin-bottom: 6px;
    }
    .capacity-hint {
      font-size: 0.8rem;
      color: #999;
      margin-top: 4px;
    }
    .founded-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      color: #555;
    }
    .location-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .location-item p { margin: 4px 0; }
    .coordinates {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      color: #777;
      font-size: 0.9rem;
    }
    .contact-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .contact-row a { color: #b5451b; }
    .no-contact { color: #999; }
    .awards-accordion { margin-top: 24px; }
    .awards-list { padding: 8px 0; }
    .award-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid #f0e6df;
    }
    .award-icon { color: #f39c12; }
  `],
})
export class BreweryDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly breweryService = inject(BreweryService);

  brewery = signal<Brewery | null>(null);
  loading = signal(true);
  showDetails = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.breweryService.getBreweryById(id).subscribe({
        next: (data) => {
          this.brewery.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate(['/breweries']);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/breweries']);
  }

  capacityPercent(): number {
    const capacity = this.brewery()?.capacity_liters ?? 0;
    return Math.min((capacity / 50000) * 100, 100);
  }
}
