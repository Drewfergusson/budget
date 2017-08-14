import { Component, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import moment from 'moment';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: FirebaseListObservable<any[]>;
  date: any;
  label: string;
  amount: number;
  queryObservable: FirebaseListObservable<any[]>;
  sizeSubject: Subject<any>;
  balance: number;

  constructor(public navCtrl: NavController, db: AngularFireDatabase) {
    this.items = db.list('/entries');
    this.sizeSubject = new Subject();
    this.queryObservable = db.list('/entries', {
      query: {
        orderByChild: 'amount'
      }
    });

    this.date = moment().toISOString();
    this.sum();
  }
  clearfields() {
    this.label = null;
    this.amount = null;
  }
  save(label: string, amount: number, selectedDate: string) {
    this.items.push({
      label: label,
      amount: amount,
      date: selectedDate
    });
    this.clearfields();
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
