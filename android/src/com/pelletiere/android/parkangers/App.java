package com.pelletiere.android.parkangers;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class App extends Activity {
	private WebView myWebView;
	private final String URL = "http://manu.habite.la/parkangers";
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        if (savedInstanceState != null)
            ((WebView)findViewById(R.id.webview)).restoreState(savedInstanceState);
        
        myWebView = (WebView) findViewById(R.id.webview);
        myWebView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        myWebView.setWebChromeClient(new WebChromeClient() {
			public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
				callback.invoke(origin, true, false);
			}
			
        });
        
        myWebView.setWebViewClient(new WebViewClient() {
        	@Override
        	public void onReceivedError(WebView view, int errorCode,
        	           String description, String failingUrl) {
        		if( URL.equals(failingUrl) ) {
        	          view.loadData("", "text/html", "UTF-8");
        	          myWebView.loadUrl("file:///android_asset/error.html");
        	    }
        	}
        });

        WebSettings webSettings = myWebView.getSettings();
        
        webSettings.setJavaScriptEnabled(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setUserAgentString(getString(R.string.user_agent));
        webSettings.setCacheMode(WebSettings.LOAD_NORMAL);
        myWebView.loadUrl(URL);
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);
	
		MenuItem itemRefresh = menu.add(Menu.NONE, 1, 1, R.string.refresh);
		itemRefresh.setIcon(android.R.drawable.ic_menu_rotate);
	
		return (super.onCreateOptionsMenu(menu));
    }

    @Override
    public boolean onMenuItemSelected(int featureId, MenuItem item) {
		switch (item.getItemId()) {
			case 1:
				myWebView.loadUrl(URL);
			    return true;
		}	
		return (super.onMenuItemSelected(featureId, item));
    }
    
    protected void onSaveInstanceState(Bundle outState) {
		myWebView.saveState(outState);
	}
}