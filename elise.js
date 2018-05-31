String.prototype.clean = function(regex) {
    var regex = regex || /[^A-Z]/gi;
    return this.replace(regex, '').toUpperCase();
};

String.prototype.reverse = function() {
    var rev = "";
    
    for (var i = this.length - 1; i >= 0; i--) {
        rev += this[i];
    }
    
    return rev;
};

String.prototype.els = function(skip, start, stop) {
    skip = skip || 1;
    start = start || 0;
    stop = stop || this.length;
    var seq = "";
    
    for (var i = start; i < stop; i += skip) {
        seq += this[i] || '';
    }
    
    return seq;
};

String.prototype.sequence = function(from, to, start, stop) {
    from = from || 1;
    to = to || this.length;
    start = start || 0;
    stop = stop || this.length;
    
    var seqs = {};

    for (var skip = from; skip <= to; skip++) {
        seqs[skip] = {};
        
        for (var pos = start; pos < stop; pos++) {
            seqs[skip][pos] = this.els(skip, pos, stop);
        }
    }
    
    return seqs;
};

String.prototype.search = function(terms, from, to, start, stop) {
    var hits = [];
    start = start || 0;
    var seqs = this.sequence(from, to, start, stop);
    
    for (var term in terms) {
        term = terms[term];
        
        for (var skip in seqs) {
            var skipRec = seqs[skip];
            
            for (var pos in skipRec) {
                var seq = skipRec[pos];

                var reversed = false;
                var index = seq.indexOf(term);
                skip = Number(skip);
                pos = Number(pos);
                
                while (index !== -1) {
                    hits.push({
                        start: pos,
                        skip: skip,
                        index: index * skip + pos,
                        term: term,
                        sequence: seq
                    });
                    
                    index = seq.indexOf(term, ++index);
                }                    
            }
        }
    }

    hits.sort(function(a, b) { return a.index - b.index; });
    hits.sort(function(a, b) { return a.skip - b.skip; });     
    hits.sort(function(a, b) { return a.start - b.start; });
    hits.sort(function(a, b) { return a.term - b.term; });    
    return hits;
};
