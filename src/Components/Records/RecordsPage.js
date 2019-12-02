import React from "react";
import { connect } from "react-redux";
import * as recordActions from "../../Redux/Actions/RecordActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import RecordList from "./RecordList";
import { Redirect } from "react-router-dom";
import Spinner from "../Common/Spinner";
import { toast } from "react-toastify";

class RecordsPage extends React.Component {
  state = {
    // loading: false,
    redirectToAddRecordPage: false
  };

  componentDidMount() {
    const { records, actions } = this.props;

    if (records.length === 0) {
      actions.loadRecords().catch(error => {
        alert("Loading records failed" + error);
      });
    }
  }

  handleDeleteRecord = async record => {
    // this.state.loading = true;
    try {
      await this.props.actions.deleteRecord(record.id);
      // this.state.loading = false;
      toast.success("Record deleted");
    } catch (error) {
      toast.error("Delete failed. " + error.message, { autoClose: false });
    }
  };

  render() {
    return (
      <>
        {this.state.redirectToAddRecordPage && <Redirect to="/record" />}
        <h2>Records</h2>
        {/* {(this.props.loading || this.state.loading) ? ( */}
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-record"
              onClick={() => this.setState({ redirectToAddRecordPage: true })}
            >
              Add Record
            </button>

            <RecordList
              onDeleteClick={this.handleDeleteRecord}
              records={this.props.records}
            />
          </>
        )}
      </>
    );
  }
}

RecordsPage.propTypes = {
  records: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    records: state.records,
    loading: state.apiCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadRecords: bindActionCreators(recordActions.loadRecords, dispatch),
      deleteRecord: bindActionCreators(recordActions.deleteRecord, dispatch),
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordsPage);