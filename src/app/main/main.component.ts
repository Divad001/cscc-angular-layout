import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Card from '../models/card';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  mainForm: FormGroup;

  showSpinner = false;
  tagsFormControl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  cards: Card[] = [];
  allTags: string[] = ['Home', 'Work'];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private _snackBar: MatSnackBar, private formBuilder: FormBuilder) {
    this.filteredTags = this.tagsFormControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
  }

  ngOnInit(): void {
    this.mainForm = this.formBuilder.group({
      emailFormControl: [null, Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]
        )],
      selectFormControl: [null, Validators.required],
      titleFormControl: [null, Validators.required],
      descFormControl: [null]
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

  addCard() {
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
      console.log(this.cards)
      this._snackBar.open('Todo card has been added to the list', 'Close', {
        duration: 4000,
      });
    }, 4000);
  }

  removeCard(card: Card) {
    const index = this.cards.indexOf(card);

    if (index >= 0) {
      this.cards.splice(index, 1);
    }
  }

  completeCard(card: Card) {
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
