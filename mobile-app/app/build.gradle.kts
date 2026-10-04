plugins {
    id("com.android.application")
}

android {
    buildFeatures { buildConfig = true }
    namespace = "za.co.cfjlifestylefitness.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "za.co.cfjlifestylefitness.app"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "0.1.0"
        testInstrumentationRunner = "za.co.cfjlifestylefitness.app.ProfileConnectionInstrumentation"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}

dependencies {
    testImplementation("junit:junit:4.13.2")
}
