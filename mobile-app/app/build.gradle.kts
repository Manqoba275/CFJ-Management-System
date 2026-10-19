// Configures Android builds, SDK versions and signing. Release builds must not silently use a debug certificate.
plugins {
    id("com.google.gms.google-services")
    id("com.android.application")
}

val signingNames = listOf("CFJ_RELEASE_STORE_FILE", "CFJ_RELEASE_STORE_PASSWORD", "CFJ_RELEASE_KEY_ALIAS", "CFJ_RELEASE_KEY_PASSWORD")
val signingValues = signingNames.associateWith { providers.environmentVariable(it).orNull }
val signingReady = signingValues.values.all { !it.isNullOrBlank() }
if (signingValues.values.any { !it.isNullOrBlank() } && !signingReady) {
    throw GradleException("Release signing configuration is incomplete. Set all four CFJ_RELEASE signing variables.")
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
    signingConfigs {
        if (signingReady) create("release") {
            storeFile = file(signingValues.getValue("CFJ_RELEASE_STORE_FILE")!!)
            storePassword = signingValues.getValue("CFJ_RELEASE_STORE_PASSWORD")
            keyAlias = signingValues.getValue("CFJ_RELEASE_KEY_ALIAS")
            keyPassword = signingValues.getValue("CFJ_RELEASE_KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            if (signingReady) signingConfig = signingConfigs.getByName("release")
        }
    }
}

// Guard packaging tasks as well as assembleRelease; never silently publish an unsigned APK.
gradle.taskGraph.whenReady {
    if (!signingReady && allTasks.any { it.project == project && it.name in listOf("packageRelease", "packageReleaseBundle", "signReleaseBundle") }) {
        throw GradleException("Release signing is not configured. See docs/deployment.md; debug builds need no release key.")
    }
}

dependencies {
    implementation(platform("com.google.firebase:firebase-bom:35.0.2"))
    implementation("com.google.firebase:firebase-auth")
    testImplementation("junit:junit:4.13.2")
}
