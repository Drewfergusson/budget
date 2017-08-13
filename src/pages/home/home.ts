import { Component, EventEmitter } from '@angular/core';
import { NavController, Keyboard } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import moment from 'moment';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: FirebaseListObservable<any[]>;
  entry: any = {};
  date: any;
  queryObservable: FirebaseListObservable<any[]>;
  sizeSubject: Subject<any>;
  balance: number;
  keyboardControls: any;

  constructor(public navCtrl: NavController, db: AngularFireDatabase, public keyboard: Keyboard) {
    this.items = db.list('/entries');
    this.sizeSubject = new Subject();
    this.queryObservable = db.list('/entries', {
      query: {
        orderByChild: 'amount'
      }
    });
    this.date = moment().toISOString();
    this.clearfields();
    this.sum();
  }
  clearfields() {
    this.entry, this.balance = null
  }
  save(label: string, amount: number, selectedDate: string) {
    this.items.push({
      label: label,
      amount: amount,
      date: selectedDate
    });
    this.keyboardControls.close();
    this.sum();
  }
  sum() {
    this.queryObservable.subscribe(queryReturn => {
      this.balance = queryReturn.reduce((acc, entry) => {
        return acc + Number(entry.amount);
      }, 0);
    });
  }
  delete(entryKey: string) {
    this.items.remove(entryKey);
  }

}
