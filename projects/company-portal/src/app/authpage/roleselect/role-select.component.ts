import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RoleSelectLabels} from './role-select-labels';
import {CurrentRoleModel} from "../../models/usermanagement/current.model";
import { isDefined } from '../../../../../common/src/lib/helpers/object.helper';

@Component({
  standalone: false,
  selector: 'app-roleselect',
  templateUrl: './role-select.component.html',
  styleUrls: ['../../../../../common/src/lib/auth/common-auth.component.scss'],
  outputs: ['cancelEvent']
})
export class RoleSelectComponent implements OnInit {

  username;
  roles: CurrentRoleModel[] = [];
  role;
  submitLocked = false;

  @Output() roleSelectEvent: EventEmitter<any> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();

  readonly Labels = RoleSelectLabels;

  constructor() {
  }

  ngOnInit() {
  }

  reInit(username: string, roles: CurrentRoleModel[]) {
    this.username = username;
    this.roles = roles;
    this.role = null;
  }

  setRole(roleId) {
    this.role = this.roles.find(role => {
        return role.id.toString() === roleId;
      }
    );
  }

  onSelect() {
    this.submitLocked = true;
    this.roleSelectEvent.emit(this.role);
    return false;
  }

  onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  isDefined(obj) {
    return isDefined(obj);
  }

  afterSubmit() {
    this.submitLocked = false;
  }
}
