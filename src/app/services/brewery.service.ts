import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Brewery } from '../models/brewery.interface';

@Injectable({
  providedIn: 'root',
})
export class BreweryService {
  private readonly apiUrl = 'https://api.openbrewerydb.org/v1/breweries';
  private readonly http = inject(HttpClient);

  getBreweries(page: number = 1, perPage: number = 20): Observable<Brewery[]> {
    return this.http
      .get<Brewery[]>(`${this.apiUrl}?page=${page}&per_page=${perPage}&sort=name:asc`)
      .pipe(map((breweries) => this.enrichBreweries(breweries)));
  }

  getBreweryById(id: string): Observable<Brewery> {
    return this.http
      .get<Brewery>(`${this.apiUrl}/${id}`)
      .pipe(map((b) => this.enrichSingle(b)));
  }

  private enrichBreweries(breweries: Brewery[]): Brewery[] {
    return breweries.map((b) => this.enrichSingle(b));
  }

  private enrichSingle(b: Brewery): Brewery {
    const enriched: Brewery = { ...b };
    // Añadimos propiedades extra manualmente para cubrir
    // componentes de Angular Material (Tabs, Expansion, Progress bar…)
    enriched.founded_year = 1990 + Math.floor(Math.random() * 34);
    enriched.capacity_liters = 5000 + Math.floor(Math.random() * 45000);
    enriched.awards = this.randomAwards();
    enriched.description = `${b.name} es una cervecería de tipo "${b.brewery_type}" ubicada en ${b.city}, ${b.country}. Conocida por su oferta artesanal y compromiso con la calidad local.`;
    return enriched;
  }

  private randomAwards(): string[] {
    const all = [
      'Gold Medal – Great American Beer Festival',
      'Best IPA – World Beer Cup',
      'Silver Award – European Beer Star',
      'Best Craft Brewery – State Award',
      'Bronze – National Homebrew Competition',
    ];
    const count = 1 + Math.floor(Math.random() * 3);
    return all.slice(0, count);
  }
}
