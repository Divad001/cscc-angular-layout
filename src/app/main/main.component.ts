import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsControl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allFruits: string[] = ['Home', 'Work'];
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'),
  ]);
  selectFormControl = new FormControl('', [
    Validators.required,
  ]);
  titleFormControl = new FormControl('', [
    Validators.required,
  ])

  @ViewChild('tagInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private _snackBar: MatSnackBar) {
    this.filteredTags = this.tagsControl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
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

    this.tagsControl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.tags.includes(event.option.viewValue)) {
      this.tags.push(event.option.viewValue);
    }
    this.fruitInput.nativeElement.value = '';
    this.tagsControl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
  }

  /* tagsControl = new FormControl([]);
  tags: string[] = ['Home', 'Work']; */

  showSpinner = false;

  loadSpinner() {
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 4000);
    setTimeout(() => {
      this._snackBar.open('Message', 'Close', {
        duration: 4000,
      })
    }, 4000)

  }

}
