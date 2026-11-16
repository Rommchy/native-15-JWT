import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

import { Colors } from "../utils/styles";
import { useDispatch, useSelector } from "react-redux";
import { getNewToken, getPosts } from "../utils/authDataService";
import { authActions } from "../store/authSlice";

const PostItem = ({ title, description, author }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.itemDescription}>{description}</Text>
    <Text style={styles.itemAuthor}>By {author}</Text>
  </View>
);

function WelcomeScreen() {
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const dispatch = useDispatch();

  const fetchPosts = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await getPosts(token);
      setFetchedPosts(response.data);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        try {
          const tokenResponse = await getNewToken(refreshToken);
          const newToken = tokenResponse.data.accessToken;
          dispatch(authActions.setToken(newToken));
          const response = await getPosts(newToken);
          setFetchedPosts(response.data);
        } catch (refreshError) {
          dispatch(authActions.logOut());
        }
      }
    } finally {
      setRefreshing(false);
    }
  }, [token, refreshToken, dispatch]);

  useEffect(() => {
    fetchPosts();
  }, []);

  // provide your implementation

  return (
    <View style={styles.rootContainer}>
      <FlatList
        onRefresh={fetchPosts}
        testID="Posts"
        refreshing={refreshing}
        data={fetchedPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostItem {...item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: Colors.primary800,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  itemDescription: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  itemAuthor: {
    fontSize: 12,
    color: Colors.primary100,
    marginTop: 5,
  },
});
