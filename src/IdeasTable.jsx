import React from 'react';
import axios from 'axios';
import { Table, Input, Button, notification } from 'antd';
import 'antd/dist/antd.css';

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'idea',
        dataIndex: 'idea',
        key: 'idea'
    },
    {
        title: 'uploadDate',
        dataIndex: 'uploadDate',
        key: 'uploadDate'
    }
];

class IdeasTable extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = {
            ideaInput: '',
            ideaSubmitting: false,
            ideasArray: []
        };
    }

    componentDidMount() {
        this.fetchIdeas();
    }

    fetchIdeas = () => {
        axios
            .get('/ideas')
            .then(response => {
                console.log('Result of getting ideas:');
                console.log(response);
                this.setState({ ideasArray: response.data });
            })
            .catch(err => {
                console.error('Failed to get ideas with err');
                console.error(err);
            });
    };

    slugify = string => {
        const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź·/_,:;';
        const b = 'aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz------';
        const p = new RegExp(a.split('').join('|'), 'g');
        return string
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with ‘and’
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    };

    onClickSubmit = () => {
        const { ideaInput } = this.state;
        this.setState({ ideaSubmitting: true });
        this.setState({ ideaInput: '' });
        axios
            .get(`/proveIt/${this.slugify(ideaInput)}`)
            .then(response => {
                console.log('Submitted new idea.');
                this.setState({ ideaSubmitting: false });
                this.fetchIdeas();
            })
            .catch(err => {
                console.error('Failed to submit with err');
                this.setState({ ideaSubmitting: false });
                console.error(err);
            });
    };

    onClickIdea = event => {
        const { idea } = event;
        axios
          .get(`/ideaProof/${idea}`)
          .then(response => {
            const { proofs } = response.data;
            if (proofs && proofs[0] && proofs[0].status) {
              notification.open({
                message: 'Idea Proof',
                description: `This idea is ${
                  proofs[0].status
                } as part of proof starting with ${proofs[0].versionProofId.substr(
                  0,
                  5
                )}.`
              });
            } else {
              notification.open({
                message: 'Failed to get Proof.',
                description: 'Could not get the proof for this idea!'
              });
            }
          })
          .catch(err => {
            console.error(err);
          });
      };

    render() {
        const { ideasArray, ideaInput, ideaSubmitting } = this.state;
        return (
            <div className="ideasTableRoot">
                <Input
                    placeholder="Add an idea!"
                    value={ideaInput}
                    onPressEnter={this.onClickSubmit}
                    onChange={e => {
                        this.setState({ ideaInput: e.target.value });
                    }}
                />
                <Button
                    type="primary"
                    loading={ideaSubmitting}
                    onClick={this.onClickSubmit}
                    style={{ margin: '10px' }}
                >
                    Submit
                </Button>
                {ideasArray !== [] && (
                    <Table
                        dataSource={ideasArray}
                        columns={columns}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {
                                    console.log('We will add some proof logic here later.');
                                    this.onClickIdea(record);
                                }, // click row
                                onDoubleClick: event => { }, // double click row
                                onContextMenu: event => { }, // right button click row
                                onMouseEnter: event => { }, // mouse enter row
                                onMouseLeave: event => { } // mouse leave row
                            };
                        }}
                    />
                )}
            </div>
        );
    }
}

export default IdeasTable;