import React, {Component} from 'react';
import SiteItem from './SiteItem';

export default class Sites extends Component {

    render(){
        return(

            this.props.sites.map((l) => (
            <SiteItem site={l} delSite={this.props.delSite}/>
            ))
          
        );
    }
}