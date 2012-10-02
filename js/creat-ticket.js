// JavaScript Document
	var classes;

	$("select#class_list").live("change", function() {
		var sel_opt = $("#class_list option:selected");
		if (sel_opt.val() == 0)
		{
			var t_ticket_classes = Handlebars.compile( $('#ht_class_list').html() );
			$('select#class_list').empty();
			$('select#class_list').append('<option data-last-child="false" value="-1" data-placeholder="true">Choose a class</option>');
			$('select#class_list').append(t_ticket_classes(getParentClasses(classes, 0, '')));
			$("select#class_list").selectmenu("refresh");
			return;
		}
		if (!sel_opt.attr("data-last-child"))
		{
			var t_ticket_classes = Handlebars.compile( $('#ht_class_list').html() );
			var class_id = sel_opt.val();
			var class_name = sel_opt.text();
			$('select#class_list').empty();
			$('select#class_list').append('<option data-last-child="false" value="'+class_id+'">' + class_name + ' (see sub-classes below)</option>');
			$('select#class_list').append(t_ticket_classes([{Id: 0, Name: "<- Go Back", IsLastChild:false}]));
			$('select#class_list').append(t_ticket_classes(getParentClasses(classes, class_id, class_name)));
			$("select#class_list").selectmenu("refresh");
		}
	});

	function create_ticket_submit() {
		if ($("select#class_list").val()<1)
		  //|| $("#class_list option:selected").attr("data-last-child") == 'false')
		{
			tooltip('Please select Class!', 'error');
			return false;
		}
		var subject = htmlEscape($('#subject').val().trim());
		var details = htmlEscape($('#details').val().trim());
		if (!subject)
		{
			tooltip('Please enter Subject!', 'error');
			return false;
		}
		else if (subject.length > 100)
		{
			tooltip('Subject should be less 100 chars!', 'error');
			return false;
		}
		else if (details.length > 5000)
		{
			tooltip('Details should be less 5000 chars!', 'error');
			return false;
		}

			var ticket = {};
			ticket["TechnicianId"] = $("#tech_list").val();
			ticket["UserId"] = $("#ticketUserId").val();
			ticket["AccountId"] = $("select#account_list").val();
			ticket["Subject"] = subject;
			ticket["InitialPost"] = details;
			ticket["ClassId"] = $("select#class_list").val();

			/* //Put alternatives to collection
		if ($("#transfer_me_alternate").is(":checked"))
		{
			//It is collection, so can be
			ticket["Technicians"] = [{"UserId":$("#ticketUserId").val()}];
		}
			*/

		/*
		//Not defined yet
		ticket["AccountLocationId"] = 0;
		ticket["LocationId"] = 0;
		ticket["Level"] = 0;
		ticket["SubmissionCategory"] = "";
		ticket["IsHandleByCallCentre"] = false;
		ticket["CreationCategoryId"] = 0;
		ticket["PriorityId"] = 0;
		ticket["SerialNumber"] = 0;
		ticket["IDMethod"] = 0;
		ticket["CustomFieldsXML"] = 0;
		ticket["TicketStatus"] = 0;
		ticket["ProjectId"] = 0;
		ticket["FolderId"] = 0;
		ticket["EstimatedTime"] = 0;
		*/

			//console.log(ticket);
		tooltip("Please wait a moment. Processing request ...");
		api.ticket_create({"Ticket": ticket,"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance"), "NoteText": "", "Password":$('#password').val()}, create_ticket_postback);

		return false;
	}

	var id;
	var ticketNumber;

	function create_ticket_postback (data)
	{
		//$(".submitButton").removeAttr("disabled");
		if (data)
		{
			id= data.Id;
			ticketNumber = data.TicketNumber;
			tooltip("Ticket #" + ticketNumber + " created successfully!", 'hdsuccess');
			$('#subject').val('');
			$('#details').val('');
			//todo: need to check when Id initialized notification                   
			if (getStorage("User.IsTechOrAdmin") != 'true')
			{
				$.mobile.changePage("home.html");
			} 
			else if ($("#transfer_me_alternate").is(":checked"))
			{
				setTimeout(attachAltTech_ticket_submit (), 2000);
			}
			else 
			{
				$.mobile.changePage("home.html");
			}												   
			return false;
		}
		else
			error("Error!");
		return false;
	}

	function attachAltTech_ticket_submit ()
	{
		if ($("#transfer_me_alternate").is(":checked"))
		{
			api.attachAltTech_ticket({"TransferToTechId":$("#ticketUserId").val(),"Id": id,"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance"), "NoteText": "", "Password":$('#password').val()}, attachAltTech_ticket_postback);
		}
		else
		{
			attachAltTech_ticket_postback({data:1});
		}
		return false;
	}

	function attachAltTech_ticket_postback (data)
	{
		if (data)
		{
			$.mobile.changePage("home.html");
		}
		else
			error("Error!");
		return false;
	}