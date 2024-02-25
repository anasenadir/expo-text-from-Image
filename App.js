import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
const App = () => {
  const camreaRef = useRef();
  const [permission, setPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState("");
  const [type, setType] = useState(CameraType.back);
  useEffect(() => {
    (async () => {
      console.log("hello1");
      const { status } = await Camera.requestCameraPermissionsAsync();
      // console.log(data);
      setPermission(status == "granted");
    })();
  }, []);
  if (permission == null) {
    return <Text>Camera Permission Denid</Text>;
  }

  if (permission == false) {
    return (
      <View style={styles.container}>
        <Text>Not Granted</Text>
      </View>
    );
  }

  const toggleCameraType = () => {
    setType((current) =>
      current == CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePhoto = async () => {
    if (camreaRef) {
      console.log("in take picture");
      try {
        let photo = await camreaRef.current.takePictureAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(photo);
        setShowCamera(false);
        return photo;
      } catch (e) {
        console.log(e);
      }
    }
  };
  console.log(showCamera);
  return (
    <View style={styles.container}>
      {showCamera == true ? (
        <View style={{ width: "100%", flex: 1, alignItems: "center" }}>
          <Camera style={styles.camera} type={type} ref={camreaRef} />
          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={{ color: "white" }}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCamera(false)}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const r = await takePhoto();
                // if (r.can)
                if (!r.cancelled) {
                  setImage(r.uri);
                }
                Alert.alert("Debug", JSON.stringify(r));
              }}
            >
              <Text style={{ color: "white" }}>Take Phote</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ width: "100%", flex: 1 }}>
          <Image
            source={{ uri: image }}
            style={{
              flex: 1,
              // width: "100%",
              backgroundColor: "red",
              alignItems: "center",
            }}
          />
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Image Placeholder
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowCamera(true)}
          >
            <Text style={{ color: "white" }}>Show Camera</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* </Camera> */}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    // height: 200,
  },
  ButtonContainer: {
    // display: "flex",
    // flex: 1,
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "35px",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: "5px 25px",
    backgroundColor: "blue",
    color: "white",
  },
});

export default App;
