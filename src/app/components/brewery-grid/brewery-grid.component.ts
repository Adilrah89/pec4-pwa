import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Brewery } from '../../models/brewery.interface';

@Component({
  selector: 'app-brewery-grid',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  template: `
    <div class="table-wrapper">
      <table mat-table [dataSource]="breweries" class="brewery-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let row">{{ row.name }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Tipo</th>
          <td mat-cell *matCellDef="let row">{{ row.brewery_type | titlecase }}</td>
        </ng-container>
        <ng-container matColumnDef="city">
          <th mat-header-cell *matHeaderCellDef>Ciudad</th>
          <td mat-cell *matCellDef="let row">{{ row.city }}</td>
        </ng-container>
        <ng-container matColumnDef="country">
          <th mat-header-cell *matHeaderCellDef>País</th>
          <td mat-cell *matCellDef="let row">{{ row.country }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button color="primary" (click)="onRowClick(row.id)">
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"
            class="table-row"
            (click)="onRowClick(row.id)"></tr>
      </table>
    </div>
  `,
  styles: [`
    .table-wrapper {
      overflow-x: auto;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .brewery-table {
      width: 100%;
      background: white;
    }
    .table-row {
      cursor: pointer;
      transition: background 0.15s;
    }
    .table-row:hover { background: #fdf3ee; }
    th.mat-mdc-header-cell {
      font-weight: 700;
      color: #7b2d0a;
      background: #fff8f5;
    }
  `],
})
export class BreweryGridComponent {
  @Input() breweries: Brewery[] = [];
  @Output() selected = new EventEmitter<string>();

  displayedColumns = ['name', 'type', 'city', 'country', 'actions'];

  onRowClick(id: string): void {
    this.selected.emit(id);
  }
}
