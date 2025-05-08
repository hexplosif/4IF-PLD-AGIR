import React from "react";
import styles from "@app/js/components/questionForm/responsesTable/responsesTable.module.css";
import { MdDeleteOutline } from "react-icons/md";
import { QuestionProps } from "@app/js/pages/createQuestion/questionApi.ts";

interface ResponsesTableProps {
    formData: QuestionProps;
    setFormData: (data: QuestionProps) => void;
    handleResponseChange: (index: number, value: string) => void;
    handleDeleteResponse: (index: number) => void;
}

const ResponsesTable: React.FC<ResponsesTableProps> = ({ formData, setFormData, handleResponseChange, handleDeleteResponse }) => {
    return (
        <table className={styles.responseTable} cellPadding="8">
            <thead>
            <tr>
                <th style={{width: "100px"}}>Correct Response</th>
                <th>Response Description</th>
                <th style={{width: "50px"}}></th>
            </tr>
            </thead>
            <tbody>
            {formData.responses.map((response, index) => (
                <tr key={index}>
                    <td>
                        <div className={styles.centerDiv}>
                            <input
                                type="radio"
                                name="correctResponse"
                                checked={formData.correct_response === index + 1}
                                onChange={() => setFormData({
                                  ...formData,
                                  correct_response: index + 1
                                })}
                            />
                        </div>
                    </td>
                    <td>
                        <textarea
                            required
                            value={response}
                            onChange={(e) => handleResponseChange(index, e.target.value)}
                            style={{marginLeft: "0.5em", width: "100%"}}
                        />
                    </td>
                    <td>
                        <button
                            type="button"
                            onClick={() => handleDeleteResponse(index)}
                            disabled={formData.responses.length <= 2}
                            style={{cursor: formData.responses.length <= 2 ? "not-allowed" : "pointer"}}
                        >
                          <MdDeleteOutline size={17}/>
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default ResponsesTable