import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Person } from './person';

interface persons {
  persons: Person[];
}

interface response {
  data: persons;
}


@Injectable({
  providedIn: 'root'
})
export class PersonService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  personsUrl = 'https://pulickans.herokuapp.com/v1/graphql';

  peronsQuery = {
    query: `{
      persons {
        id
        name
        mother {
          id
          name
        }
        father {
          id
          name
        }
      }
    }
    `
  }

  constructor(private http: HttpClient) { }

  getPersons(): Observable<Person[]> {
    return this.http.post<response>(this.personsUrl, this.peronsQuery, this.httpOptions).pipe(
      map<response, Person[]>(response => response.data.persons),
    );
  }
}
