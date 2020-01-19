import { Component, OnInit, ElementRef } from '@angular/core';
import vis from 'vis';
import _ from 'lodash';

import { PersonService } from './person.service';
import { Person } from './person';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pulickans';
  persons: Person[];
  nodes: Node[];

  getPersons(): void {
    this.personService.getPersons().subscribe(persons => {
      this.persons = persons.map(person => {
        return {
          label: person.name,
          ...person,
        }
      });
      const nodes = new vis.DataSet(this.persons);
      const edges = _.chain(this.persons).map(person => {
        const father = person.father;
        const mother = person.mother;
        const fatherEdge = father ? { from: person.id, to: father.id } : undefined;
        const motherEdge = mother ? { from: person.id, to: mother.id } : undefined;
        const edges = [];
        if (fatherEdge) {
          edges.push(fatherEdge);
        }
        if (motherEdge) {
          edges.push(motherEdge);
        }
        return edges;
      }).reduce((edges, edgeArray) => {
        if (edgeArray.length > 0) {
          edges.push(edgeArray[0]);
        }
        if (edgeArray.length > 1) {
          edges.push(edgeArray[1]);
        }
        return edges;
      }, []).value();
      const data = { nodes: nodes, edges: edges };
      const element = this.elt.nativeElement.querySelector('#mynetwork');
      const options = {};
      const network = new vis.Network(element, data, options);
    });
  }

  constructor(private personService: PersonService, private elt: ElementRef) { }

  ngOnInit() {
    this.getPersons();
  }
}
