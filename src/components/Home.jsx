function Home({Unity, unityProvider, isLoaded, sendMessage}) {
    return (
        <Unity 
            unityProvider={unityProvider}  
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                margin: "auto",
                visibility: isLoaded ? "visible" : "hidden",
            }}
            devicePixelRatio={2}
        />
    );
}

export default Home;