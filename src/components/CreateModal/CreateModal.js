import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Modal} from 'react-bootstrap';
import { Auth, graphqlOperation, API } from 'aws-amplify';
import * as mutations from '../../graphql/mutations';

class CreateModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        name: '',
        status: ''
      };

      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleStatusChange = this.handleStatusChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleCreateScore = this.handleCreateScore.bind(this);
    }

    handleNameChange(event) {
      this.setState({
        name: event.target.value
      });
    }

    handleStatusChange(event) {
      this.setState({
        status: event.target.value
      });
    }

    handleSubmit(event) {
      event.preventDefault();
      this.props.handleShow();
      this.handleCreateScore();
      
      
      this.props.history.push({
        pathname: '/EditScore',
        search: this.state.name,
        state: {
          name: this.state.name
        }
      });
      console.log(this.props.history.state);
      
    }

    handleCreateScore = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const userId = user.username;
      const scoreCreated = await API.graphql(graphqlOperation(mutations.createScore, {
          input: {
              id: this.state.name,
              name: this.state.name,
              status: this.state.status,
              scoreUserId: userId
          }
      }));
      console.log(scoreCreated);
    }

    render(){
      return (
        <>     
          <Modal show={this.props.modal} onHide={this.props.handleShow}>
            <form onSubmit={this.handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Music File</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div className="row">
                  <div className="form-group col-md-4">
                    <label>Name:</label>
                    <input type="text" value={this.state.name} onChange={this.handleNameChange} className="form-control" required/>                   
                  </div>  
                </div>
              </Modal.Body>

              <Modal.Footer>
                <label>Privacy:</label>
                <select value={this.state.status}>
                      <option value="PRIVATE">Private</option>
                      <option value="PUBLIC">Public</option>
                </select>
                
                <Button variant="danger" onClick={this.props.handleShow}>Cancel</Button>
                <input type="submit" value="Submit" color="primary" className="btn btn-primary" />

                
              </Modal.Footer>
            </form>
          </Modal>
        </>
      );
    }
}

export default withRouter(CreateModal);