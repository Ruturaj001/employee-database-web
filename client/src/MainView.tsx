import React from "react";

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";

import { Card } from "azure-devops-ui/Card";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Table, ITableRow, ITableColumn, TableCell } from "azure-devops-ui/Table";
import { ObservableArray } from "azure-devops-ui/Core/Observable";
import { Spinner } from "azure-devops-ui/Spinner";

import { IEmployee } from "./Contract";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { AddEditEmployeeDialog } from "./AddEditEmployeeDialog";
import { getAllEmployees } from "./EmployeeRestClient";

/**
 * Dialog that lets user add new days off
 */
export class MainContent extends React.Component {
    columns: Array<ITableColumn<IEmployee>>;
    commandBarItems: IHeaderCommandBarItem[];
    data: ObservableArray<IEmployee>;
    loading: ObservableValue<boolean>;
    selectedEmployee: IEmployee | undefined;
    showDialog: ObservableValue<boolean>;
    selectedIndex: number;

    constructor(props: any) {
        super(props);
        this.commandBarItems = [
            {
                iconProps: {
                    iconName: "Add"
                },
                id: "testCreate",
                important: true,
                onActivate: this.onAddClick,
                text: "Add",
                tooltipProps: {
                    text: "Add new Employee to database"
                }
            }
        ];
        this.columns = [
            {
                id: "firstName",
                name: "First Name",
                width: 150,
                renderCell: this.renderFirstNameColumn
            },
            {
                id: "lastName",
                name: "Last Name",
                width: 150,
                renderCell: this.renderLastNameColumn
            },
            {
                id: "hireDate",
                name: "Hire Date",
                width: 100,
                renderCell: this.renderHireDateColumn
            },
            {
                id: "role",
                name: "Role",
                width: 100,
                renderCell: this.renderRoleColumn
            },
            {
                id: "favoriteJoke",
                name: "Favorite Joke",
                width: -50,
                minWidth: 200,
                renderCell: this.renderFavoriteJokeColumn
            },
            {
                id: "favoriteQuote",
                name: "Favorite Quote",
                width: -50,
                minWidth: 200,
                renderCell: this.renderFavoriteQuoteColumn
            }
        ];
        this.data = new ObservableArray<IEmployee>([]);
        this.loading = new ObservableValue<boolean>(true);
        this.showDialog = new ObservableValue<boolean>(false);
        this.selectedIndex = 0;
    }

    public render(): JSX.Element {
        return (
            <Page className="flex-noshrink">
                <Header title={"Employee Database"} commandBarItems={this.commandBarItems} titleSize={0} />
                <div className="page-content page-content-top">
                    <Card>
                        <Observer list={this.data} loading={this.loading}>
                            {(props: { list: IEmployee[]; loading: boolean }) => {
                                return props.loading === true ? (
                                    <Spinner />
                                ) : props.list.length === 0 ? (
                                    <div>No data.</div>
                                ) : (
                                    <Table<IEmployee>
                                        className="flex-noshrink"
                                        columns={this.columns}
                                        itemProvider={new ArrayItemProvider<IEmployee>(props.list)}
                                        onActivate={this.onEmployeeClick}
                                    />
                                );
                            }}
                        </Observer>
                    </Card>
                </div>
                <Observer dialog={this.showDialog}>
                    {(props: { dialog: boolean }) => {
                        return props.dialog === true ? (
                            <AddEditEmployeeDialog
                                employee={this.selectedEmployee}
                                list={this.data}
                                onDismiss={this.onDismiss}
                                refetchData={this.refetchData}
                                selectedIndex={this.selectedIndex}
                            />
                        ) : null;
                    }}
                </Observer>
            </Page>
        );
    }

    componentDidMount() {
        this.refetchData();
    }

    refetchData = (): void => {
        getAllEmployees().then(employees => {
            this.data.value = employees;
            this.loading.value = false;
        });
    };

    private onAddClick = (): void => {
        this.showDialog.value = true;
        this.selectedEmployee = undefined;
    };

    onDismiss = (): void => {
        this.showDialog.value = false;
    };

    private onEmployeeClick = (event: React.SyntheticEvent<HTMLElement>, tableRow: ITableRow<IEmployee>): void => {
        this.selectedIndex = tableRow.index;
        this.showDialog.value = true;
        this.selectedEmployee = tableRow.data;
    };

    private renderFirstNameColumn = (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IEmployee>, item: IEmployee): JSX.Element => {
        return (
            <TableCell columnIndex={columnIndex} key={"col-" + columnIndex}>
                <span>{item.firstName}</span>
            </TableCell>
        );
    };

    private renderLastNameColumn = (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IEmployee>, item: IEmployee): JSX.Element => {
        return (
            <TableCell columnIndex={columnIndex} key={"col-" + columnIndex}>
                <span>{item.lastName}</span>
            </TableCell>
        );
    };

    private renderHireDateColumn = (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IEmployee>, item: IEmployee): JSX.Element => {
        return (
            <TableCell columnIndex={columnIndex} key={"col-" + columnIndex}>
                <span>{item.hireDate}</span>
            </TableCell>
        );
    };

    private renderRoleColumn = (rowIndex: number, columnIndex: number, tableColumn: ITableColumn<IEmployee>, item: IEmployee): JSX.Element => {
        return (
            <TableCell columnIndex={columnIndex} key={"col-" + columnIndex}>
                <span>{item.role}</span>
            </TableCell>
        );
    };

    private renderFavoriteJokeColumn = (
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<IEmployee>,
        item: IEmployee
    ): JSX.Element => {
        return (
            <TableCell columnIndex={columnIndex} key={"col-" + columnIndex}>
                <div className="long-sentence">{item.favoriteJoke}</div>
            </TableCell>
        );
    };

    private renderFavoriteQuoteColumn = (
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<IEmployee>,
        item: IEmployee
    ): JSX.Element => {
        return (
            <TableCell columnIndex={columnIndex} key={"col-" + columnIndex}>
                <div className="long-sentence">{item.favoriteQuote}</div>
            </TableCell>
        );
    };
}
