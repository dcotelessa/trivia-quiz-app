import { shuffleArray, decodeHtmlEntities } from '../../src/utils/helpers';

describe('Helper Utilities', () => {
  describe('shuffleArray', () => {
    it('should return a new array with the same elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray([...original]);
      
      // Same length
      expect(shuffled.length).toBe(original.length);
      
      // Same elements, but maybe different order
      expect(shuffled.sort()).toEqual(original.sort());
      
      // Check it's not the same reference
      expect(shuffled).not.toBe(original);
    });

    it('should handle empty arrays', () => {
      const empty: number[] = [];
      expect(shuffleArray(empty)).toEqual([]);
    });

    it('should handle arrays with a single element', () => {
      const single = ['test'];
      expect(shuffleArray(single)).toEqual(single);
    });
  });

  describe('decodeHtmlEntities', () => {
    it('should decode HTML entities in a string', () => {
      const encoded = '&amp; &lt; &gt; &quot; &#039; &rsquo; &ldquo; &eacute;';
      const decoded = '& < > " \' \' " é';
      
      expect(decodeHtmlEntities(encoded)).toBe(decoded);
    });

    it('should handle empty strings', () => {
      expect(decodeHtmlEntities('')).toBe('');
    });

    it('should handle null or undefined values', () => {
      expect(decodeHtmlEntities(null as unknown as string)).toBe('');
      expect(decodeHtmlEntities(undefined as unknown as string)).toBe('');
    });

    it('should return the original string if no entities to decode', () => {
      const original = 'No entities here';
      expect(decodeHtmlEntities(original)).toBe(original);
    });
  });
});
