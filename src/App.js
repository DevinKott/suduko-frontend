import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

function App() {
    //const [game, setGame] = useState(`600000001090040060000617000003000200062050180007000600000165000080090040300000005`);
    const [game, setGame] = useState(
        `000000000000000000000000000000000000000000000000000000000000000000000000000000000`
    );
    const [loading, setLoading] = useState(false);

    const fetch = async () => {
        setLoading(true);
        const result = await axios(
            `https://ghh35l6n76.execute-api.us-east-2.amazonaws.com/prod/solveSuduko?gameState=${game}`
        );
        setLoading(false);

        if (
            result.data === "Could not solve." ||
            result.data === `No gameState query parameter defined.` ||
            result.data === `No query parameters defined.`
        ) {
        } else {
            setGame(result.data);
        }
    };

    if (loading) {
        return (
            <Root>
                <div className="loader"></div>
            </Root>
        );
    }

    // Build the matrix.
    let matrix = [];
    let matrixIndex = 0;
    matrix[0] = [];
    for (let i = 0; i < game.length; i++) {
        const num = parseInt(game.charAt(i));
        if (matrix[matrixIndex].length < 9) {
            matrix[matrixIndex].push(num);
        } else {
            matrixIndex += 1;
            matrix[matrixIndex] = [num];
        }
    }

    // Build the table
    let table = matrix.map((row, rowIndex) => {
        const cells = row.map((cell, cellIndex) => {
            return (
                <Cell
                    key={`cell-row${rowIndex}-cell${cellIndex}`}
                    blackBorderBottom={rowIndex === 2 || rowIndex === 5}
                    blackBorderLeft={cellIndex === 3 || cellIndex === 6}
                >
                    <CellInput
                        type="text"
                        pattern={`/d`}
                        inputMode={`numeric`}
                        defaultValue={cell === 0 ? `` : `${cell}`}
                        onChange={event => {
                            const inp = event.target.value;

                            if (!inp || inp === "" || isNaN(inp)) {
                                event.preventDefault();
                                event.target.value = "";
                            } else {
                                let toSet = inp;
                                if (inp > 9 || inp < 0) {
                                    event.preventDefault();
                                    event.target.value = "";
                                    toSet = 0;
                                }

                                let index = rowIndex * 9 + cellIndex;
                                setGame(
                                    game.substring(0, index) +
                                        toSet +
                                        game.substring(index + 1)
                                );
                            }
                        }}
                    ></CellInput>
                </Cell>
            );
        });

        return <tr key={`row-row${rowIndex}`}>{cells}</tr>;
    });

    return (
        <Root>
            <Table>
                <TableBody>{table}</TableBody>
            </Table>
            <button
                onClick={() => {
                    fetch();
                }}
            >
                Solve
            </button>
        </Root>
    );
}

const TableBody = styled.tbody``;

const Cell = styled.td`
    width: 20pt;
    height: 20pt;

    border-left: ${props => (props.blackBorderLeft ? `black` : `#DDDDEE`)} solid
        1px;
    border-bottom: ${props => (props.blackBorderBottom ? `black` : `#DDDDEE`)}
        solid 1px;
    padding: 0;
`;

const CellInput = styled.input`
    width: 20pt;
    height: 20pt;

    border: solid 0;
    margin: 0;
    padding: 0;
    text-align: center;
    outline: none;

    -webkit-appearance: none;
    -moz-appearance: textfield;
`;

const Table = styled.table`
    border: #ddddee solid 1px;
    border-collapse: collapse;
`;

const Root = styled.div`
    height: 100vh;
    padding: 0;
    margin: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export default App;
