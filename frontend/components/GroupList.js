import React, { useState, useEffect } from "react";
import { FlatList, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import GroupCard from "./GroupCard";

function GroupList() {
    const [groups, setGroups] = useState([]); // holds API data
    const [loading, setLoading] = useState(true); // shows loader
    const [error, setError] = useState(null); //stores errors

      //api get request using fetch
    useEffect(() => { //useEffect is a hook that runs after the first render
      // https://react.dev/reference/react/useEffect
        fetch(`/api/v1/groups/`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log("API Response:", data);
            setGroups(data.results || []); // ensure correct structure
        })
        .catch((error) => {
            console.error("Fetch Error:", error.message);
            setError(error.message);
        })
        .finally(() => setLoading(false));
    }, []
    );

    if (loading) return <ActivityIndicator size="large" color="purple" style={styles.loader} />;
    if (error) return <Text style={styles.error}>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.data.id.toString()} // ensure IDs are strings
                renderItem={({ item }) => <GroupCard group={item.data} />} // pass data object
                contentContainerStyle={styles.listContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    loader: {
        marginTop: 50,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default GroupList;
