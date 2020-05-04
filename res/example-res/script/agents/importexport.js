class ImgUploader {

	constructor ( _bus ) {
		this.bus = _bus;
	}

	handleEvent(evt) {
		console.log("handleEvent " + evt.type);
		switch(evt.type) {
		case "change":
			console.log("--------------handle upload event");
			console.log(evt);
			this.handleUpload( evt );

		break;
		}
	}

	handleUpload(e){

		var reader = new FileReader();
		var BUS = this.bus;

		var thisFileName = e.target.files[0].name;

		reader.onload = function(event){

			console.log("reader onload " + thisFileName);

			var img = new Image();

			img.onload = function(){


				console.log("image onload ");

				var sig = [];
				sig[0] = "PAINT";
				sig[1] = "IMPORTIMAGE";
				sig.data = { img: img, name: thisFileName };
				BUS.post( sig );

			}

			img.src = event.target.result;
		}

		console.log("read " + e.target.files[0]);
		console.log(e.target.files[0]);
		reader.readAsDataURL(e.target.files[0]);

	}

}

class ImportExportAgent  {

	getId() {
		return 'ImportExport';
	}

    constructor( _bus, _imageLoader, _imageSaver ) {

		this.bus = _bus;
		this.imageLoader = _imageLoader;
		this.imageSaver = _imageSaver;
		this.imgUploader = new ImgUploader( _bus );

		/* Self register */
		this.bus.register( this, ['IMPORT','EXPORT'], '*' );

	}

	activate() {
	}

	/* App events */
	handleInputSignal( sig ) {
		console.log( "importexport got signal " + sig[0]);
		if( sig[ 0 ] == 'IMPORT' ) {

			switch( sig[ 1 ] ) {
				case 'LOAD':
					this.load();

			}
		}
		else if( sig[ 0 ] == 'EXPORT' ) {

			switch( sig[ 1 ] ) {
				case 'SAVE':
					this.save( sig.data.canvas, sig.data.options, sig.data.name );
				break;
			}
		}
	}

	/* Browser events */
	handleEvent(evt) {
	}

	downloadURI(uri, name) {

		  var link = document.getElementById( this.imageSaver );

		  link.download = name;
		  link.href = uri;
		  link.click();
		  //https://stackoverflow.com/questions/8863940/how-to-force-chrome-display-a-save-as-dialog-when-i-click-a-download-link
		  //http://danml.com/download.html


	}


	save( _canvas, options, _name ) {
		var canvas = _canvas;

		if( options.transparency == 'background' ) {
			var orig = new ImageCanvasContext();
			orig.initWithCanvasOnly( canvas );
			var clone = orig.copy();
			clone.makeTransparentMaskFromColor( options.bgcolor );

			canvas = clone.canvas;
		}

		if( canvas.msToBlob !== undefined) {

			console.log("save to blob");
			var blob = canvas.msToBlob();
			window.navigator.msSaveBlob(blob, _name );

		}
		else {

			console.log("save to data url");
			var url = canvas.toDataURL("image/png");
			this.downloadURI( url, _name );
		}

	}


	load() {

		//var ImgUploader = this.imgUploader;
		var imageLoader = document.getElementById( this.imageLoader );

		console.log( imageLoader );
		imageLoader.addEventListener('change', this.imgUploader, true);
		imageLoader.click();


	}

}
