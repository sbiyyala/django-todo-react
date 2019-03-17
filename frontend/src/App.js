// frontend/src/App.js

import React, {Component} from "react";
import Modal from "./components/Modal";
import {connect} from "react-redux";
import {
    addItem,
    deleteItem,
    refreshList,
    updateItem
} from "./redux/reducers/reducer";

import PropTypes from "prop-types";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            activeItem: {
                title: "",
                description: "",
                completed: false
            },
            todoList: []
        };
    }

    componentDidMount() {
        const {refreshList} = this.props;
        refreshList();
    }

    displayCompleted = status => {
        if (status) {
            return this.setState({viewCompleted: true});
        }
        return this.setState({viewCompleted: false});
    };

    renderTabList = () => {
        return (
            <div className="my-5 tab-list">
        <span
            onClick={() => this.displayCompleted(true)}
            className={this.state.viewCompleted ? "active" : ""}
        >
          complete
        </span>
                <span
                    onClick={() => this.displayCompleted(false)}
                    className={this.state.viewCompleted ? "" : "active"}
                >
          Incomplete
        </span>
            </div>
        );
    };

    renderItems = () => {
        const {todoList} = this.props;
        const {viewCompleted} = this.state;
        const newItems = todoList.filter(
            item => item.completed === viewCompleted
        );
        return newItems.map(item => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center">
        <span
            className={`todo-title mr-2 ${
                this.state.viewCompleted ? "completed-todo" : ""
                }`}
            title={item.description}>
          {item.title}
        </span>
                <span>
          <button
              onClick={() => this.editItem(item)}
              className="btn btn-secondary mr-2">
            {" "}
              Edit{" "}
          </button>
          <button
              onClick={() => this.handleDelete(item)}
              className="btn btn-danger"
          >
            Delete{" "}
          </button>
        </span>
            </li>
        ));
    };

    toggle = () => {
        this.setState({modal: !this.state.modal});
    };

    handleSubmit = item => {
        const {addItem, updateItem} = this.props;
        this.toggle();
        if (item.id) {
            updateItem(item);
        } else {
            addItem(item);
        }
    };

    handleDelete = item => {
        const {deleteItem} = this.props;
        deleteItem(item);
    };

    createItem = () => {
        const item = {title: "", description: "", completed: false};
        this.setState({activeItem: item, modal: !this.state.modal});
    };

    editItem = item => {
        this.setState({activeItem: item, modal: !this.state.modal});
    };

    render() {
        return (
            <main className="content">
                <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
                <div className="row ">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="">
                                <button onClick={this.createItem} className="btn btn-primary">
                                    Add task
                                </button>
                            </div>
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                {this.state.modal ? (
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    >
                    </Modal>
                ) : null}
            </main>
        );
    }
}

App.propTypes = {
    todoList: PropTypes.array.isRequired,
    addItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    refreshList: PropTypes.func.isRequired

};

const mapStateToProps = ({reducer: {todoList}}) => ({
    todoList
});

const mapDispatchToProps = {refreshList, addItem, updateItem, deleteItem};

export default connect(mapStateToProps, mapDispatchToProps)(App);
