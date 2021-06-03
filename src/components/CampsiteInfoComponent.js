import React, {Component} from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Breadcrumb, BreadcrumbItem,
    Button, Modal, ModalHeader, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            touched: {
                author: false,
            }
        };

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render(){
    return(
        <React.Fragment>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader>Your Comments</ModalHeader>
                <LocalForm onSubmit={values => this.handleSubmit(values)}>
                    <div className="form-group col-md-10">
                        <Label htmlfor="rating">Rating</Label>
                            <Control.select model=".rating" id="rating" name="rating" className="form-control">
                                <option></option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                    </div>
                    <div className="form-group col-md-10">
                        <Label htmlfor="author">Your Name</Label>
                        <Control.text model=".author" id="author" name="author" 
                            className="form-control"
                            validators={{
                                required,
                                minLength: minLength(2),
                                maxLength: maxLength(15),
                            }}
                        />
                        <Errors
                            className="text-danger"
                            model=".author"
                            show="touched"
                            component="div"
                            messages={{
                                required: 'Required',
                                minLength: 'Must be at least 2 characters',
                                maxLength: 'Must be 15 characters or less',
                            }}
                        />
                    </div>
                    <div className="form-group col-md-10">
                        <Label htmlfor="text">Text</Label>
                            <Control.textarea model=".text" id="text" name="text" rows="6" className="form-control"
                            />
                    </div>
                    <div className="form-group col-md-10">
                    <Button type="submit" color="primary">Submit</Button>
                    </div>
                </LocalForm>
            </Modal>

            <Button onClick={this.toggleModal} outline>
                <i className="fa fa-pencil fa-lg" /> Submit Comment
            </Button>
        </React.Fragment>
    )};
}

function RenderCampsite({campsite}) {
    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({comments, addComment, campsiteId}) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                {comments.map(comment => {return(
                    <div key={comment.id}>
                        <p>{comment.text}</p>
                        <p>-- {comment.author},
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                    </div>
                )})}
                <CommentForm campsiteId={campsiteId} addComment={addComment} />
            </div>
        )
    } else {
    <div />
    }
}

function CampsiteInfo(props) {
    if (props.campsite) {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <h2>{props.campsite.name}</h2>
                    <hr />
                </div>
            </div>
            <div className="row">
                <RenderCampsite campsite={props.campsite} />
                <RenderComments 
                    comments={props.comments} 
                    addComment={props.addComment}
                    campsiteId={props.campsite.id}
                    />
            </div>
        </div>
    );
    }
    return <div />
}



export default CampsiteInfo;