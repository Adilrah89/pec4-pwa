import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Brewery } from '../../models/brewery.interface';

@Component({
  selector: 'app-brewery-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <mat-card class="brewery-card" (click)="onCardClick()">
      <div class="card-header-bar" [ngClass]="typeColorClass"></div>
      <mat-card-header>
        <mat-card-title>{{ brewery.name }}</mat-card-title>
        <mat-card-subtitle>{{ brewery.city }}, {{ brewery.country }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="type-chip">
          <mat-icon class="type-icon">local_bar</mat-icon>
          <span>{{ brewery.brewery_type | titlecase }}</span>
        </div>
        @if (brewery.phone) {
          <p class="contact-info">
            <mat-icon>phone</mat-icon> {{ brewery.phone }}
          </p>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-flat-button color="primary" (click)="onCardClick(); $event.stopPropagation()">
          Ver detalles
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .brewery-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-radius: 12px !important;
      overflow: hidden;
    }
    .brewery-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
    }
    .card-header-bar {
      height: 6px;
      width: 100%;
    }
    .type-micro { background: #b5451b; }
    .type-brewpub { background: #e67e22; }
    .type-large { background: #2980b9; }
    .type-regional { background: #27ae60; }
    .type-contract { background: #8e44ad; }
    .type-default { background: #95a5a6; }
    .type-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 0.9rem;
      color: #555;
    }
    .type-icon { font-size: 18px; height: 18px; width: 18px; }
    .contact-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      color: #777;
      margin-top: 6px;
    }
    .contact-info mat-icon { font-size: 16px; height: 16px; width: 16px; }
  `],
})
export class BreweryCardComponent {
  @Input() brewery!: Brewery;
  @Output() selected = new EventEmitter<string>();

  get typeColorClass(): string {
    const map: Record<string, string> = {
      micro: 'type-micro',
      brewpub: 'type-brewpub',
      large: 'type-large',
      regional: 'type-regional',
      contract: 'type-contract',
    };
    return map[this.brewery.brewery_type] ?? 'type-default';
  }

  onCardClick(): void {
    this.selected.emit(this.brewery.id);
  }
}
