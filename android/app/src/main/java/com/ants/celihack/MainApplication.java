package com.ants.celihack;

import android.app.Application;
import android.util.Log;

import com.evollu.react.fa.FIRAnalyticsPackage;
import com.facebook.react.ReactApplication;
import com.rnuxcam.rnuxcam.UXCamPackage;
import cl.json.RNSharePackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }



        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
            new UXCamPackage(),
                new RNSharePackage(),
                new FacebookLoginPackage(),
                new ImageResizerPackage(),
                    new FIRAnalyticsPackage(),
                new LocationServicesDialogBoxPackage(),
                new VectorIconsPackage(),
                new ImagePickerPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
