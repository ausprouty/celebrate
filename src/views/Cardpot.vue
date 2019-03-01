var memForm = app.toFormData(app.newMember);
			axios.post('api.php?crud=create', memForm)
				.then(function(response){
					//console.log(response);
					app.newMember = {firstname: '', lastname:''};
					if(response.data.error){
						app.errorMessage = response.data.message;
					}
					else{
						app.successMessage = response.data.message
						app.getAllMembers();
					}