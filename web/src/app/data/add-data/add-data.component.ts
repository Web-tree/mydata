import { Component, OnInit } from '@angular/core';
import {DataService} from '../../_service/data.service';
import {Data} from '../../_model/data';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {
  model: Data = new Data();

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  public onSubmit() {
    this.dataService.save(this.model).subscribe();
  }

}
