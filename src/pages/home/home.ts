import { Component, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import moment from 'moment';
import { Subject } from 'rxjs/Subject';
import { $, in$, $of } from 'moneysafe';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: FirebaseListObservable<any[]>;
  date: any = moment().toISOString();
  label: string;
  amount: number;
  queryObservable: FirebaseListObservable<any[]>;
  sizeSubject: Subject<any>;
  balance: number;
  tentativeTransaction: boolean = false;

  constructor(public navCtrl: NavController, db: AngularFireDatabase) {
    this.items = db.list('/entries');
    this.sizeSubject = new Subject();
    this.queryObservable = db.list('/entries', {
      query: {
        orderByChild: 'amount'
      }
    });

    this.sum();
  }
  clearfields() {
    this.label = null;
    this.amount = null;
  }
  save(label: string, amount: number, selectedDate: string, tentative: boolean) {
    this.items.push({
      label: label,
      amount: amount,
      date: selectedDate,
      tentative: tentative
    });
    this.clearfields();
    this.sum();
  }
  sum() {
    this.queryObservable.subscribe(queryReturn => {
      let ledgerSum = queryReturn.reduce((acc, entry) => {
        return acc + $(entry.amount);
      }, $(0));
      this.balance = in$(ledgerSum);
    });
  }
  delete(entryKey: string) {
    this.items.remove(entryKey);
  }

}
