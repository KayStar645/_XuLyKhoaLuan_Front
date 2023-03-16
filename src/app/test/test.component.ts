import { userService } from 'src/app/services/user.service';
import { raDeService } from './../services/raDe.service';
import { DeTai_ChuyenNganh } from './../models/DeTai_ChuyenNganh.model';
import { Component, OnInit } from '@angular/core';
import { RaDe } from '../models/RaDe.model';
import { User } from '../models/User.model';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {

  constructor(
    private raDeService : raDeService,
    private userService: userService,
    ) { }

  ngOnInit(): void {
  }

  async taoTaiKhoan() {
    try {
      await this.userService.addTeacher(new User("GV00021", "GV00021"));
    } catch (error) {
      console.log(error);
    }
  }

  async xoaTaiKhoan() {
    console.log("Xóa nè")
    try {
      await this.userService.delete("GV00021");
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    await this.raDeService.getAll();
  }

  async getById() {
    try {
      var result = await this.raDeService.getByMaGvMaDt("", "DT0002");
      console.log(result);
    } catch (error) {
      console.log(error);
    }

  }

  async Add() {
    var dtcn = new RaDe();
    dtcn.maDt = "DT0002";
    dtcn.maGv = "GV00001";

    try {
      await this.raDeService.add(dtcn);  
    } 
    catch (error) {
     console.log(error); 
    }
  }


  async Delete() {
    await this.raDeService.delete("GV00001", "DT0002");
  }
}