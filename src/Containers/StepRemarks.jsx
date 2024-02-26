import { useContext, useState, useEffect } from 'react'
import { ModelContext } from '../Components/ModelContext.jsx';

let counter = 1;
let stepArray = new Array();
let stepRemarksArray = new Array();
let arrayNumber = 0;
let filteredArr = new Array();
let stepRemarks;

//Get data from the Workbook
axios.get('https://sheets.googleapis.com/v4/spreadsheets/18hHq4XYLPYSN1Wc0RjY5zl5vCHoVVrlugpG-O7cULLw/values/Workbook?key=AIzaSyCqcO7MQv4dsj76ps3nNJnMwTT8Cvqv-eM')
    .then(response => {

        let ourData = response.data.values;
        let bufferArray = new Array();

        for (const row of ourData) {
            if (counter > 2 && row[1] != '') {
                stepArray.push(bufferArray);
                bufferArray = new Array();
                bufferArray.push(row);
            } else {
                bufferArray.push(row);
            }

            ++counter;
        }

    })

export default function StepRemarks() {

    let { stepCount } = useContext(ModelContext)

    useEffect(() => {

        stepRemarks = new Array();

        //Change list of remarks
        for (const row of stepArray[stepCount + 1]) {
            if (row[10] != '') {
                filteredArr = new Array();
                stepRemarksArray.push(filteredArr);
                filteredArr.push(row[10]);
            }
            else {
                // filteredArr.splice(row[10], 1)
                filteredArr.push(row[10]);
            }

            stepRemarks.push(filteredArr);
            //stepRemarks += '\n';
            //stepRemarks += '\n';

            ++counter;
        };

    }, [stepCount])

    return <>
        <div>
            <ul>
                {stepRemarks ? stepRemarks.map((name, index) => <li key={index}> {name}</li>) : null}

            </ul>
        </div>
    </>


}