import {Grid, MenuItem, Select, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import {Button} from "@material-ui/core";

export function EditClass(props){

    const { selectedClass } = useSelector((state) => state.teacher)

    return (
        <div className="ui container">
            <div className="ListingsTableContainer_listingsTableContainer__h1r2j ">
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Edit Class</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <button
                                onClick={() => {
                                    console.log("Clicky")

                                }}
                                className="ui small primary button"
                            >Save</button>
                        </div>
                    </div>
                </div>
                <Grid container>
                    <Grid item xs={8}>
                        <div className={"inputFields"}>
                            <h4>Name</h4>
                            <TextField
                                fullWidth={true}
                                className="textInput"
                                color="error"
                                value={selectedClass.name}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={"inputFields"}>
                            <h4>Location</h4>
                            <Select className="selectMenu" fullWidth={true}>
                                {
                                    selectedClass.location.map((item, index) => {
                                        return(
                                            <MenuItem className="selectItem" key={`${item + index}`} value={item}>{item}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <div className="inputFields">
                        <h4>Description</h4>
                        <TextField
                            multiline
                            fullWidth={true}
                            className="textInput"
                            color="error"
                            value={selectedClass.description}
                        />
                    </div>
                </Grid>
            </div>
            <div>
                <div className="ui container">
                    <div className="dcl tabs">
                        <div className="dcl tabs-left">
                            <h4>Enrollments</h4>
                        </div>
                        <div className="dcl tabs-right">
                            <button
                                onClick={() => {
                                    console.log("Clicky")

                                }}
                                className="ui small primary button"
                            >Add</button>
                        </div>
                    </div>
                </div>
                <div className="tableContainer">
                    <div className="TableContent">
                        <table className="ui very basic table">
                            <tbody>
                            <tr>
                                <th>Name</th>
                                <th></th>
                            </tr>

                            {
                                selectedClass.enrollments.map((item, index) => {
                                    return (
                                        <tr key={`Contributor_${index}`}>
                                            <td>
                                                {item}
                                            </td>
                                            <td>
                                                <Button
                                                    className="ui small basic button"
                                                    size="small"
                                                    variant="contained"
                                                >Remove</Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
   )
}