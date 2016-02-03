Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    
    
    launch: function() {
        //Test log with current date/time
        console.log('Test log to console: ', Date().toLocaleString());
        
        
        this.add({
			xtype: 'rallycombobox',
			stateful: true,
			stateId: this.getContext().getScopedStateId('initiative'),
			width: 500,
			fieldLabel: 'Select Initiative:',
			// Display Template
			displayTpl: Ext.create('Ext.XTemplate','<tpl for=".">','{FormattedID} - {Name}','</tpl>'),
			// List Template
			tpl: Ext.create('Ext.XTemplate','<tpl for=".">','<div class="x-boundlist-item">{FormattedID} - {Name}</div>','</tpl>'),
			storeConfig: {
				autoLoad: true,
				model: 'PortfolioItem/Initiative',
				fetch: ['FormattedID', 'Name'],
				sorters: [
					{
						property: 'ObjectID',
						direction: 'ASC'
					}
				],
				remoteGroup: false,
				remoteSort: false,
				remoteFilter: false,
				limit: Infinity
				/*
				context: {
					project: project_oid,
					projectScopeDown: true,
					projectScopeUp: false
				}
				*/
			},
			// stateful: false,
			listeners: {
				select: this._onSelect,
				ready: this._onLoad,
				scope: this
			}
		});
        
        
        /*
        this.add({
            xtype: 'rallyusersearchcombobox',
            fieldLabel: 'Filter by Owner:',
            project: this.getContext().getProject(),
            //value: Rally.util.Ref.getRelativeUri(this.getContext().getUser()),
            listeners: {
                select: this._onSelect,
                ready: this._onLoad,
                scope: this
            }
        });
        */
        
    },

    _onLoad: function() {
        this.add({
            xtype: 'rallycardboard',
            types: [
                'User Story'
            ],
            //attribute: 'ScheduleState',
            attribute: 'c_RefiningSubState',
            context: this.getContext(),
            storeConfig: {
                //filters: [this._getOwnerFilter()]
                fetch: [
                    'Feature'
                ],
                filters: [
                    this._getFilter()
                ]
            },
            cardConfig: {
				fields: [
                    'Feature',
                    'Project'
                ],
				showIconsAndHighlightBorder: false
			}
			
			//swimlanes if needed
			/*
            rowConfig: {
                field: 'Owner'
			}
			*/
            
        });
    },

    _onSelect: function() {
        var board = this.down('rallycardboard');
        board.refresh({
            storeConfig: {
                filters: [
                    this._getFilter()
                ]
            }
        });
    },




    
    /*
    _getOwnerFilter: function() {
        var userCombo = this.down('rallyusersearchcombobox');
        return {
            property: 'Owner',
            operator: '=',
            value: userCombo.getValue()
        };
    },
    */
    
    
    
    
    _getFilter: function() {
		var combo = this.down('rallycombobox');
		
		//filter on selected Initiative
		var filters = Ext.create('Rally.data.QueryFilter', {
			property: 'Feature.Parent.Parent',
			operator: '=',
			value: combo.getValue()
		});
		
		//exclude parent user stories, only return leaf stories
		filters = filters.and({
			property: 'DirectChildrenCount',
			operator: '=',
			value: '0'
		});
		
		/*
		filters = filters.and({
			property: 'Iteration',
			operator: '=',
			value: null
		});
		*/
		
		// filters = filters.and({
			// property: 'AcceptedDate',
			// operator: '<',
			// value: 'LastMonth'
		// });
		
		
		//include only stories that are in Refining state
		filters = filters.and({
			property: 'ScheduleState',
			operator: '=',
			value: 'Refining'
		});
		
		
		
		//TEST: Filter string output
		console.log(filters.toString());
		
		//selected filters are returned
		return filters;
	}
    
    
    
});
