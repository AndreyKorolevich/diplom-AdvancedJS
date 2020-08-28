const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain',

  item(level) {
    switch (level) {
      case 1: return themes.prairie;
      case 2: return themes.desert;
      case 3: return themes.arctic;
      case 4: return themes.mountain;
      default: return themes.mountain;
    }
  },

};

export default themes;
