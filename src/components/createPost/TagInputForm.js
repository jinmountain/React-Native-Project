import React, { useContext, useState, useEffect } from "react";
import { 
  TouchableOpacity, 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  FlatList 
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { InputFormBottomLine } from '../InputFormBottomLine';
import { Context as PostContext } from '../../context/PostContext';
import { AntDesign } from '@expo/vector-icons';

// Color
import color from '../../color';

// icons
import expoIcons from '../../expoIcons';

const TagInputForm = ({ tags, setTags }) => {
  // const { 
  //   state: { tags }, 
  //   makeNewTag, 
  //   deleteTag 
  // } = useContext(PostContext);
  const [tagTextInput, setTagTextInput] = useState('');

  const timestamp = () => {
    return Date.now()
  };

  const hasWhiteSpace = (s) => {
    if (/\s/g.test(s) === true) {
      const trimmedString = s.trim();
      if (trimmedString.length > 0) {
        let stringLeft = trimmedString;
        if (stringLeft.indexOf(' ') > 0) {
          const words = stringLeft.split(" ");
          setTags([...tags, ...words]);
        } else {
          setTags([...tags, String(stringLeft)]);
        }
        setTagTextInput('');
      } else {
        setTagTextInput('');
      }
    }
  }

  useEffect (() => {
    hasWhiteSpace(tagTextInput);
  }, [tagTextInput])

  return (
    <View style={styles.tagFormContainer}>
      <View style={styles.textInputLabelContainer}>
        {tags.length < 1 
          ? <Text style={styles.textInputLabel}>Tags</Text>
          : <View style={styles.tagsContainer} >
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={tags}
                keyExtractor={(tag, index) => index.toString()}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity 
                      onPress={() => {
                        setTags([...tags.filter((tag) => tag !== item)]);
                      }}
                    >
                      <View style={styles.unitContainer}>
                        <View style={styles.tagsContainer}>
                          {expoIcons.snailShell(RFValue(15), color.red2)}
                          <Text style={styles.tagText}>
                            {item}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }}
              />
            </View>
        }
      </View>
      <TextInput
        style={styles.input}
        placeholder={'Insert each tag using a space'}
        placeholderTextColor={color.grey1}
        onChangeText={(text) => setTagTextInput(text)}
        value={tagTextInput}
        maxLength={50}
        multiline={false}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <InputFormBottomLine customStyles={{backgroundColor: color.red2, marginTop: RFValue(3)}} />
    </View>
  );
};

const styles = StyleSheet.create({
  tagFormContainer: {
    marginHorizontal: RFValue(10),
    marginTop: RFValue(10),
  },
  textInputLabel: {
    fontSize: RFValue(12),
    marginTop: RFValue(10),
    color: color.red2
  },
  textInputLabelContainer: {
    minHeight: RFValue(25),
    paddingVertical: RFValue(11),
  },
  input: {
    fontSize: RFValue(17),
    height: RFValue(35),
    overflow: 'hidden',
    paddingLeft: RFValue(10),
  },
  unitContainer: {
    borderWidth: 0.5,
    borderColor: color.grey3,
    borderRadius: RFValue(8),
    marginRight: RFValue(5),
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(5),
  },
  tagsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  tagText: {
    color: color.black1,
    marginLeft: 3,
    fontSize: RFValue(18),
  }
});

export default TagInputForm;