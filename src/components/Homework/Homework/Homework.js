import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import './Homework.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import console = require('console');

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
    console.log('==> dest', destination);

    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, { ...item, id: uuidv4() });
    return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const Content = styled.div`
    margin-right: 200px;
`;

const Item = styled.div`
    display: flex;
    user-select: none;
    padding: 0.5rem;
    margin: 0 0 0.5rem 0;
    align-items: flex-start;
    align-content: flex-start;
    line-height: 1.5;
    border-radius: 3px;
    background: #fff;
    border: 1px ${props => (props.isDragging ? 'dashed #4099ff' : 'solid #ddd')};
`;

const Clone = styled(Item)`
    + div {
        display: none !important;
    }
`;

const Handle = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    user-select: none;
    margin: -0.5rem 0.5rem -0.5rem -0.5rem;
    padding: 0.5rem;
    line-height: 1.5;
    border-radius: 3px 0 0 3px;
    background: #fff;
    border-right: 1px solid #ddd;
    color: #000;
`;

const List = styled.div`
    border: 1px
        ${props => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
    background: #fff;
    color: #31C75A;
    padding: 1.5rem;
    border-radius: 3px;
    flex: 0 0 150px;
    width: 35rem;
    font-family: poppins;
    font-weight: 600;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.7);
    border-radius: 15px;
`;

const Kiosk = styled(List)`
    width: 25rem;
`;

const Container = styled(List)`
    margin: 0.5rem 0.5rem 1.5rem;
    background: white;
`;

const Notice = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding: 0.5rem;
    margin: 0 0.5rem 0.5rem;
    border: 1px solid transparent;
    line-height: 1.5;
    color: #aaa;
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    margin: 0.5rem;
    padding: 0.5rem;
    color: white;
    border: 1px solid #ddd;
    background: #31C75A;
    border-radius: 5px;
    font-size: 1rem;
    font-family: poppins;
    cursor: pointer;
`;

const ButtonText = styled.div`
    margin: 0 1rem;
`;

const ITEMS = [
    {
        id: uuidv4(),
        content: <input className='field' type="text" placeholder='Text Field' />
    },
    {
        id: uuidv4(),
        content: <textarea className='field' name="textarea" placeholder='Text Area' cols="30" rows="5"></textarea>
    },
    {
        id: uuidv4(),
        content:
            <div>
                <input type="checkbox" value="Add Item" name="add-item" /> <input className='checkbox-input' type="text" />
                <button className='add-item'>+</button>
            </div>
    },
    {
        id: uuidv4(),
        content:
            <div>
                <input type="radio" value="Add Item" name="add-item" /> <input className='radio-input' type="text" />
                <button className='add-item'>+</button>
            </div>
    },
    {
        id: uuidv4(),
        content: <input className='field' type="file" name="file" />
    },
    {
        id: uuidv4(),
        content: 'Quote'
    }
];

class Homework extends Component {
    state = {
        [uuidv4()]: []
    };
    onDragEnd = result => {
        const { source, destination } = result;

        console.log('==> result', result);

        // dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    [destination.droppableId]: reorder(
                        this.state[source.droppableId],
                        source.index,
                        destination.index
                    )
                });
                break;
            case 'ITEMS':
                this.setState({
                    [destination.droppableId]: copy(
                        ITEMS,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            default:
                this.setState(
                    move(
                        this.state[source.droppableId],
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                );
                break;
        }
    };

    addList = e => {
        this.setState({ [uuidv4()]: [] });
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <div className='main'>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Content>
                        <Button onClick={this.addList}>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                                />
                            </svg>
                            <ButtonText>Add List</ButtonText>
                        </Button>
                        {Object.keys(this.state).map((list, i) => {
                            console.log('==> list', list);
                            return (
                                <Droppable key={list} droppableId={list}>
                                    {(provided, snapshot) => (
                                        <Container
                                            ref={provided.innerRef}
                                            isDraggingOver={
                                                snapshot.isDraggingOver
                                            }>
                                            {this.state[list].length
                                                ? this.state[list].map(
                                                    (item, index) => (
                                                        <Draggable
                                                            key={item.id}
                                                            draggableId={item.id}
                                                            index={index}>
                                                            {(
                                                                provided,
                                                                snapshot
                                                            ) => (
                                                                <Item
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    isDragging={
                                                                        snapshot.isDragging
                                                                    }
                                                                    style={
                                                                        provided
                                                                            .draggableProps
                                                                            .style
                                                                    }>
                                                                    <Handle
                                                                        {...provided.dragHandleProps}>
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 24 24">
                                                                            <path
                                                                                fill="currentColor"
                                                                                d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                                                            />
                                                                        </svg>
                                                                    </Handle>
                                                                    {item.content}
                                                                </Item>
                                                            )}
                                                        </Draggable>
                                                    )
                                                )
                                                : !provided.placeholder && (
                                                    <Notice>
                                                        Drop items here
                                                    </Notice>
                                                )}
                                            {provided.placeholder}
                                        </Container>
                                    )}
                                </Droppable>
                            );
                        })}
                    </Content>
                    <Droppable droppableId="ITEMS" isDropDisabled={true}>
                        {(provided, snapshot) => (
                            <Kiosk
                                ref={provided.innerRef}
                                isDraggingOver={snapshot.isDraggingOver}>
                                {ITEMS.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <React.Fragment>
                                                <Item
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    isDragging={snapshot.isDragging}
                                                    style={
                                                        provided.draggableProps
                                                            .style
                                                    }>
                                                    {item.content}
                                                </Item>
                                                {snapshot.isDragging && (
                                                    <Clone>{item.content}</Clone>
                                                )}
                                            </React.Fragment>
                                        )}
                                    </Draggable>
                                ))}
                            </Kiosk>
                        )}
                    </Droppable>
                    <Button id='submit-btn'>Submit</Button>
                </DragDropContext>
            </div>
        );
    }
}

export default Homework;