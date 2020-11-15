import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Card from '../models/card';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  removable: boolean = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  showSpinner:boolean = false;
  mainForm: FormGroup;
  tagsFormControl: FormControl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  cards: Card[] = [
    new Card(
      'test@test.test',
      'Low',
      ['Home'],
      'Test',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ),
    new Card(
      'test@test.test',
      'High',
      ['Work'],
      'Test',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    ),
    new Card(
      'test@test.test',
      'Medium',
      ['Else'],
      'Test',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    ),
    new Card('test@test.test', 'High', [], 'Test', 'Test'),
    new Card(
      'test@test.test',
      'Low',
      ['Home', 'Work', 'Else', 'Asdasd', 'asdqwdca', 'asd'],
      'Test',
      'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small'
    ),
  ];


  allTags: string[] = ['Home', 'Work'];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.filteredTags = this.tagsFormControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
  }

  ngOnInit(): void {
    this.mainForm = this.formBuilder.group({
      emailFormControl: [
        null,
        Validators.pattern(
          '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'
        ),
      ],
      selectFormControl: [null, Validators.required],
      titleFormControl: [null, Validators.required],
      descFormControl: [null],
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim() && !this.tags.includes(value)) {
      this.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.tagsFormControl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.tags.includes(event.option.viewValue)) {
      this.tags.push(event.option.viewValue);
    }
    this.tagInput.nativeElement.value = '';
    this.tagsFormControl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(filterValue) === 0
    );
  }

  addCard(): void {
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 4000);
    let temp: Card = new Card(
      this.mainForm.value.emailFormControl,
      this.mainForm.value.selectFormControl,
      this.tags,
      this.mainForm.value.titleFormControl,
      this.mainForm.value.descFormControl
    );
    setTimeout(() => {
      this.cards.push(temp);
      this.mainForm.reset();
      this._snackBar.open('Todo card has been added to the list', 'Close', {
        duration: 4000,
      });
    }, 4000);
  }

  removeCard(card: Card): void {
    const index = this.cards.indexOf(card);

    if (index >= 0) {
      this.cards.splice(index, 1);
    }
  }

  completeCard(card: Card): void {
    const index = this.cards.indexOf(card);

    if (index >= 0) {
      if (this.cards[index].isComplete === false) {
        this.cards[index].complete(true);
        console.log(this.cards);
      } else {
        this.cards[index].complete(false);
        console.log(this.cards);
      }
    }
  }
}
