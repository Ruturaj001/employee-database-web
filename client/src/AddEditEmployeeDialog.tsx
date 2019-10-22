import React from "react";
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import { CustomDialog } from "azure-devops-ui/Dialog";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { IListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { MessageCard } from "azure-devops-ui/MessageCard";
import { ObservableValue, ObservableArray } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import { PanelHeader, PanelFooter, PanelContent } from "azure-devops-ui/Panel";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { IEmployee } from "./Contract";
import { TextField } from "azure-devops-ui/TextField";
import { formatDate } from "./DateLib";
import { updateEmployee, createEmployee, deleteEmployee, getFavoriteJoke, getFavoriteQuote } from "./EmployeeRestClient";

const roles = ["CEO", "VP", "MANAGER", "LACKEY"];

interface IAddEditEmployeeDialogProps {
    /**
     * End date for event
     */
    employee?: IEmployee;

    /**
     * Callback function on dialog dismiss
     */
    onDismiss: () => void;

    list: ObservableArray<IEmployee>;

    refetchData: () => void;

    selectedIndex: number;
}

/**
 * Dialog that lets user add new days off
 */
export class AddEditEmployeeDialog extends React.Component<IAddEditEmployeeDialogProps> {
    memberSelection: IListSelection;
    message: ObservableValue<string>;
    okButtonEnabled: ObservableValue<boolean>;
    firstName: ObservableValue<string>;
    lastName: ObservableValue<string>;
    hireDate: string;
    maxDate: string;
    role: string;
    favoriteJoke: ObservableValue<string>;
    favoriteQuote: ObservableValue<string>;

    constructor(props: IAddEditEmployeeDialogProps) {
        super(props);

        this.okButtonEnabled = new ObservableValue<boolean>(true);
        this.message = new ObservableValue<string>("");
        this.memberSelection = new DropdownSelection();

        if (this.props.employee) {
            this.firstName = new ObservableValue(this.props.employee.firstName);
            this.lastName = new ObservableValue(this.props.employee.lastName);
            this.hireDate = this.props.employee.hireDate;
            this.maxDate = formatDate(new Date());
            this.role = this.props.employee.role;
            this.memberSelection.select(roles.indexOf(this.props.employee.role));
            this.favoriteJoke = new ObservableValue<string>(this.props.employee.favoriteJoke);
            this.favoriteQuote = new ObservableValue<string>(this.props.employee.favoriteQuote);
        } else {
            this.firstName = new ObservableValue("");
            this.lastName = new ObservableValue("");
            this.hireDate = formatDate(new Date());
            this.maxDate = formatDate(new Date());
            this.role = roles[3];
            this.memberSelection.select(3);
            this.favoriteJoke = new ObservableValue<string>("");
            this.favoriteQuote = new ObservableValue<string>("");
            this.fetchJokeAndQuote();
        }
    }

    async fetchJokeAndQuote() {
        this.favoriteJoke.value = await getFavoriteQuote();
        this.favoriteQuote.value = await getFavoriteQuote();
    }

    public render(): JSX.Element {
        return (
            <CustomDialog onDismiss={this.props.onDismiss}>
                <PanelHeader
                    onDismiss={this.props.onDismiss}
                    showCloseButton={false}
                    titleProps={{ text: this.props.employee ? "Edit employee" : "Create new employee" }}
                />
                <PanelContent>
                    <div className="flex-grow flex-column dialog-content">
                        <Observer message={this.message}>
                            {(props: { message: string }) => {
                                return props.message !== "" ? <MessageCard className="flex-self-stretch">{props.message}</MessageCard> : null;
                            }}
                        </Observer>
                        <div className="input-row flex-row">
                            <span>First name</span>
                            <TextField className="column-2" onChange={this.onInputFirstName} value={this.firstName} />
                        </div>
                        <div className="input-row flex-row">
                            <span>Last name</span>
                            <TextField className="column-2" onChange={this.onInputLastName} value={this.lastName} />
                        </div>
                        <div className="input-row flex-row">
                            <span>Hire date</span>
                            <div className="bolt-textfield column-2">
                                <input
                                    className="bolt-textfield-input input-date"
                                    defaultValue={this.hireDate}
                                    max={this.maxDate}
                                    onChange={this.onInputHireDate}
                                    type="date"
                                />
                            </div>
                        </div>
                        <div className="input-row flex-row">
                            <span>Role</span>
                            <Dropdown className="column-2" items={roles} onSelect={this.onSelectRole} placeholder={this.role} />
                        </div>
                        <div className="input-row flex-row">
                            <span>Favorite joke</span>
                            <TextField className="column-2" onChange={this.onInputFavoriteJoke} value={this.favoriteJoke} multiline={true} />
                        </div>
                        <div className="input-row flex-row">
                            <span>Favorite quote</span>
                            <TextField className="column-2" onChange={this.onInputFavoriteQuote} value={this.favoriteQuote} multiline={true} />
                        </div>
                    </div>
                </PanelContent>
                <PanelFooter>
                    <div className="flex-grow flex-row">
                        {this.props.employee && <Button onClick={this.onDeleteClick} subtle={true} text="Delete employee" />}
                        <ButtonGroup className="bolt-panel-footer-buttons flex-grow">
                            <Button onClick={this.props.onDismiss} text="Cancel" />
                            <Button onClick={this.onOKClick} primary={true} text="Ok" />;
                        </ButtonGroup>
                    </div>
                </PanelFooter>
            </CustomDialog>
        );
    }

    private onInputHireDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.hireDate = e.target.value;
    };

    private onInputFirstName = (e: React.ChangeEvent, value: string): void => {
        this.firstName.value = value;
    };

    private onInputFavoriteJoke = (e: React.ChangeEvent, value: string): void => {
        this.favoriteJoke.value = value;
    };

    private onInputFavoriteQuote = (e: React.ChangeEvent, value: string): void => {
        this.favoriteQuote.value = value;
    };

    private onInputLastName = (e: React.ChangeEvent, value: string): void => {
        this.lastName.value = value;
    };

    private onSelectRole = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
        this.role = item.text || roles[3];
    };

    private onDeleteClick = (): void => {
        deleteEmployee(this.props.employee!.id!).then(() => {
            this.props.onDismiss();
            this.props.list.splice(this.props.selectedIndex, 1);
        });
    };

    private onOKClick = (): void => {
        if (this.validateSelections()) {
            const employee: IEmployee = {
                firstName: this.firstName.value,
                lastName: this.lastName.value,
                hireDate: this.hireDate,
                role: this.role,
                favoriteJoke: this.favoriteJoke.value,
                favoriteQuote: this.favoriteQuote.value
            };

            if (this.props.employee) {
                employee.id = this.props.employee.id;
                updateEmployee(employee).then(employee => {
                    this.props.list.splice(this.props.selectedIndex, 1, employee);
                    this.props.onDismiss();
                });
            } else {
                createEmployee(employee).then(employee => {
                    this.props.list.push(employee);
                    this.props.onDismiss();
                });
            }
        }
    };

    private validateSelections = (): boolean => {
        this.okButtonEnabled.value = this.firstName.value !== "" && this.lastName.value !== "";
        if (this.firstName.value === "") {
            this.message.value = "First name can not be empty.";
        } else if (this.lastName.value === "") {
            this.message.value = "Last name can not be empty.";
        } else {
            this.message.value = "";
        }
        return this.okButtonEnabled.value;
    };
}
